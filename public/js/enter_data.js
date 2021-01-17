var id = window.location.search.split('=')[1];
console.log(id);

var crt, alt, con, lvl, tabledata, flag=false, leave_nodes=[], filledCrt = [];
fetch("/gethierarchy", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
  },
  body: JSON.stringify({ id }),
})
.then((response) => {
  return response.json();
})
.then((data) => {
  fetch("/gethierarchyinfo", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify({ id }),
  })
  .then((res) => {
    return res.json();
  })
  .then((info) => {
    crt = data;
    alt = info.alternatives;
    con = info.consistency;
    lvl = info.level;
    hierarchy_id = info.hierarchy_id;
    console.log(data, info);
    console.log('whole Data fetched ');
    document.getElementById('hierarchy-sv-to-cloud-btn').disabled = false;
    document.getElementById('hierarchy-cmpt-result-btn').disabled = false;
    var treeviewbtn = getTreeViewBtn();
    document.getElementById('hierarchy-body-heading').parentElement.appendChild(treeviewbtn);
    createAlternative(alt);
    tabledata = generateTableData(crt);
    fetch("/getdataset", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify({ id }),
    })
    .then((r) => {
      return r.json();
    })
    .then((tab_data) => {
      if(tab_data[0] !== 'No Document Find'){
        console.log("Previous record found");
        flag = true;
        tabledata = tab_data;
        // console.log(tabledata);
        getEmptyCriterias(tabledata, '1');
      }
      else{
        console.log("no previous record found");
      }
      console.log(filledCrt);
      createHierarchy(crt);
    })
    .catch((e) => {
      window.location.assign('/dataset');
    });
  })
  .catch((err) => {
    // console.log(err);
    window.location.assign('/dataset');
  });
})
.catch((error) => {
  window.location.assign('/dataset');
});


/* ===========  Creating hierarchy and Alternative view ====================== */

function getEmptyCriterias(tab, id){
  if(tab[0] !== 'XXX'){
    filledCrt.push(id);
  }
  for( var i=0 ; i<tab[1].length; i++){
    getEmptyCriterias(tab[1][i], id+'-'+i);
  }
  // table data, filledCrt, crt
}
function createHierarchy(crt){
  var elem = document.getElementById('hierarchy-view-list');
  var br = document.createElement('BR');
  var root = getHierarchyViewNode(crt[0], '1');
  elem.appendChild(br);
  elem.appendChild(root);
  var i;
  if(crt[1].length === 0){
    leave_nodes.push('1');
  }
  for( i=0; i<crt[1].length; i++){
    addViewCriteria(root.querySelector(".nested"), crt[1][i], "1-"+i);
  }
  addToggleListner();
}
function addViewCriteria(elem, crt, id){
  var node = getHierarchyViewNode(crt[0], id);
  var br = document.createElement('BR');
  elem.appendChild(br);
  elem.appendChild(node);
  var i;
  if(crt[1].length === 0){
    leave_nodes.push(id);
  }
  for( i=0; i<crt[1].length; i++){
    addViewCriteria(node.querySelector(".nested"), crt[1][i], id+'-'+i);
  }
}
function getHierarchyViewNode(val, id){
  /* 
  <li>
    <div style="display: flex;">
      <span class="caret">
        <button class="hierarchy-view-node-down-btn"><i class="fas fa-angle-down" style="font-size: larger;"></i></button>
      </span>
      <div class="hierarchy-view-node-div empty">
        <p style="margin-top: 0.4vh;">GOAL</p>
        <button id="$id" class="hierarchy-view-node-edt-btn" onclick="showTable(this.id)"><i class="far fa-pen" style="font-size: large;"></i></button>
      </div>
    </div>
    <ul class="nested active"></ul>
  </li>
  */
  var li = document.createElement('LI');
  var d = document.createElement('DIV');
  var spn = document.createElement('SPAN');
  var bt_dw = document.createElement('BUTTON');
  var ic_dw = document.createElement('I');
  var d1 = document.createElement('DIV');
  var p = document.createElement('P');
  var info = document.createTextNode(val);
  var bt_ed = document.createElement('BUTTON');
  var ic_ed = document.createElement('I');
  var ul = document.createElement('UL');

  d.setAttribute("style", "display: flex;");
  spn.setAttribute("class", "caret");
  bt_dw.setAttribute("class", "hierarchy-view-node-down-btn");
  ic_dw.setAttribute("class", "fas fa-angle-down");
  ic_dw.setAttribute("style", "font-size: larger;");
  if(filledCrt.indexOf(id) !== -1){
    d1.setAttribute("class", "hierarchy-view-node-div");
  }
  else{
    d1.setAttribute("class", "hierarchy-view-node-div empty");
  }
  p.setAttribute("style", "margin-top: 0.4vh;");
  bt_ed.setAttribute("class", "hierarchy-view-node-edt-btn");
  bt_ed.setAttribute("id", id);
  bt_ed.setAttribute("onclick", "showTable(this.id)");
  ic_ed.setAttribute("class", "fas fa-pen");
  ic_ed.setAttribute("style", "font-size: large;");
  ul.setAttribute("class", "nested active")

  bt_dw.appendChild(ic_dw);
  spn.appendChild(bt_dw);
  p.appendChild(info);
  bt_ed.appendChild(ic_ed);
  d1.appendChild(p);
  d1.appendChild(bt_ed);
  d.appendChild(spn);
  d.appendChild(d1);
  li.appendChild(d);
  li.appendChild(ul);
  return li;
}
function addToggleListner() {
  var elem = document.getElementsByClassName('caret');
  var i;
  for (i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function() {
      this.querySelector(".fas").classList.toggle("fa-angle-right");
      this.parentElement.parentElement.querySelector(".nested").classList.toggle("active");
    });
  }
}
function createAlternative(alt){
  var elem = document.getElementById('alternative-body-list');
  var i;
  for( i=0; i<alt.length ;i++){
    var n = getAlternativeViewNode(alt[i], 2);
    var br = document.createElement('BR');
    elem.appendChild(n);
    elem.appendChild(br);
  }
}
function getAlternativeViewNode(val , id){
/*
<li>
  <div class="alternative-view-node"> Altenative 1 </div>
</li>
*/
  var li = document.createElement('LI');
  var d = document.createElement('DIV');
  var info  = document.createTextNode(val);

  d.setAttribute("class", "alternative-view-node");
  d.setAttribute("id", id);

  d.appendChild(info);
  li.appendChild(d);
  return li;
}


/* =====================  Tree View  ========================== */
function showTreeView() {
  document.querySelector('.main').classList.toggle("tree-toggle");
  document.querySelector('.tree').classList.toggle("tree-toggle");
  var chart_config = [];
  var config = {
    container: "#Hierarchy-tree",
    nodeAlign: "BOTTOM",
    connectors: {
        type: 'step'
    }
  }
  var root = {
    text: {
        name: crt[0]
    }
  }
  chart_config.push(config);
  chart_config.push(root);
  createTreeView(root, crt[1], chart_config);
  new Treant( chart_config );
}
function closeTreeView() {
  document.querySelector('.main').classList.toggle("tree-toggle");
  document.querySelector('.tree').classList.toggle("tree-toggle");
}
function createTreeView(parent, crt, ans) {
  var i;
  for( i=0; i<crt.length; i++){
    var val = crt[i][0];
    var node = {
      parent: parent,
      innerHTML: val
    };
    ans.push(node);
    createTreeView(node, crt[i][1], ans);
  }
}

/* ======================   Utility functions =================== */
function showSnackbar() {
  var x = document.getElementById("sk-bar");
  x.classList.toggle("show"); 
  setTimeout(function(){ 
    x.classList.toggle("show"); 
  }, 3000);
}
function getTreeViewBtn(){
  var btn = document.createElement('BUTTON');
  var icn = document.createElement("I");

  btn.setAttribute("id", "hierarchy-body-tree-btn");
  btn.setAttribute("onclick", "showTreeView()")
  icn.setAttribute("class", "fas fa-sitemap");
  btn.appendChild(icn);
  return btn;
}

/* ======================   Dataset Tables functions  ================ */

var table;
var clicked_crt_id;
function showTable(id) {
  clicked_crt_id = id;
  var data = getTableDataById(tabledata, id);
  document.querySelector('.main').classList.toggle("table-toggle");
  document.querySelector('.datatable').classList.toggle("table-toggle");
  var T,A;
  var val = document.getElementById(id).previousSibling.innerHTML;
  console.log(leave_nodes);
  if(leave_nodes.indexOf(id) !== -1){
    A = alt;
    T = getTable(val, 1);
  }
  else{
    T = getTable(val, 0);
    var childs = document.getElementById(id).parentElement.parentElement.parentElement.querySelector('.nested').childNodes;
    var idx = [];
    for(var i=1; i<childs.length; i+=2){
      var val = childs[i].querySelector('.hierarchy-view-node-div').childNodes[0].innerHTML;
      idx.push(val);
    } 
    A = idx;
  }
  var elem = document.getElementsByClassName('datatable')[0];
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
  elem.append(T);
  var table_data = getTabledata(A, data);
  var columndata = getColumndata(A);

  table = new Tabulator("#table-really", {
    data: table_data,
    columns: columndata,
    cellEdited:function(cell){
      var val = cell.getValue();
      var r = A.indexOf(cell.getRow().getData().name);
      var c = parseInt(cell.getColumn().getField().slice(5));
      if(val === '1'){
      }
      else if(val.length > 1){
        val = val.slice(2);
      }
      else{
        val = '1/'+val;
      }
      console.log(val);
      console.log(r, c);
      var txt = '{"id" : "'+c+'", "name": "'+A[c]+'", "value'+r+'": "'+val+'"}';
      console.log(txt);
      var p = JSON.parse(txt);
      table.updateData([p]);
    },
  });

  table.clearSort();
}
function getTabledata(A, data){
  var ans = [];
  if(data === 'XXX'){
    for(var i=0; i<A.length; i++){
      var txt = '{"id" : "'+i+'", "name": "'+A[i]+'"';
      for(var j=0; j<A.length; j++) {
        if(i>j){
          txt += ', "value'+j+'": "1/9"';
        }
        else if(i<j) {
          txt += ', "value'+j+'": "9"';
        }
        else {
          txt += ', "value'+j+'": "1"';
        }
      }
      txt += '}'
      console.log(txt);
      var p = JSON.parse(txt);
      ans.push(p);
    }
  }
  else{
    for(var i=0; i<A.length; i++){
      var txt = '{"id" : "'+i+'", "name": "'+A[i]+'"';
      for(var j=0; j<A.length; j++) {
        if(i>j){
          txt += ', "value'+j+'": "'+data[i][j]+'"';
        }
        else if(i<j) {
          txt += ', "value'+j+'": "'+data[i][j]+'"';
        }
        else {
          txt += ', "value'+j+'": "'+data[i][j]+'"';
        }
      }
      txt += '}'
      console.log(txt);
      var p = JSON.parse(txt);
      ans.push(p);
    }
  }
  console.log(ans);
  return ans;
}
function getColumndata(A){
  var editCheck = function (cell) {
    var r = A.indexOf(cell.getRow().getData().name);
    var c = parseInt(cell.getColumn().getField().slice(5));
    if(r===c){
      return false;
    }
    return true;
  }
  var ans = [];
  ans.push({title: '', field:'name', frozen:true, headerSort:false});
  for(var i=0; i<A.length; i++){
    var p = {title: A[i], field:'value'+i, editable:editCheck, editor:"select", editorParams:{values:{"1":"1", "3":"3", "5":"5", "7":"7", "9":"9", "1/3":"1/3", "1/5":"1/5", "1/7":"1/7", "1/9":"1/9"}}, headerSort:false}
    ans.push(p);
  }
  console.log(ans);
  return ans;
}
function getTableDataById(M, id){
  if(id.length === 1){
    return M[0];
  }
  else{
    id = id.slice(2);
    return getTableDataById(M[1][id[0]], id);
  }
}
function getTable(t, x){
  /* 
    <div id="table-main">
      <div style="display: inline-flex; height: 10vh;">
        <div id="table-alt-heading"><b>Pairwise-Comparision between Alternatives W.R.T Salary</w></b></div>
        <button id="table-save-btn" onclick="saveTable()"><i class="fas fa-save"></i></button>
        <button id="table-close-btn" onclick="closeTable()"><i class="fas fa-times"></i></button>
      </div>
      <div id="table-body">
        <div id="table-really">
          ===========   Table   ==============
        </div>
      </div>
    </div>
  */
  var mn_tab = document.createElement('DIV');
  if(x!==0){
    // leave node table
    var head_div = document.createElement('DIV');
    var heading_div = document.createElement('DIV');
    var B = document.createElement('B');
    var info = document.createTextNode('Pairwise-Comparision between Alternatives W.R.T '+t);
    var sv_btn = document.createElement('BUTTON');
    var sv_icn = document.createElement('I');
    var cl_btn = document.createElement('BUTTON');
    var cl_icn = document.createElement('I');

    head_div.setAttribute('style', 'display: inline-flex; height: 10vh;');
    heading_div.setAttribute('id', 'table-alt-heading');
    sv_icn.setAttribute('class', 'fas fa-save');
    sv_btn.setAttribute('id', 'table-save-btn');
    sv_btn.setAttribute('onclick', 'saveTable()');
    cl_icn.setAttribute('class', 'fas fa-times');
    cl_btn.setAttribute('id', 'table-close-btn');
    cl_btn.setAttribute('onclick', 'closeTable()');

    B.appendChild(info);
    heading_div.appendChild(B);
    sv_btn.appendChild(sv_icn);
    cl_btn.appendChild(cl_icn);
    head_div.appendChild(heading_div);
    head_div.appendChild(sv_btn);
    head_div.appendChild(cl_btn);

    mn_tab.appendChild(head_div);
  }
  else{
    var head_div = document.createElement('DIV');
    var heading_div = document.createElement('DIV');
    var B = document.createElement('B');
    var info = document.createTextNode('Pairwise-Comparision between Sub Criterias of '+t);
    var sv_btn = document.createElement('BUTTON');
    var sv_icn = document.createElement('I');
    var cl_btn = document.createElement('BUTTON');
    var cl_icn = document.createElement('I');

    head_div.setAttribute('style', 'display: inline-flex; height: 10vh;');
    heading_div.setAttribute('id', 'table-alt-heading');
    sv_icn.setAttribute('class', 'fas fa-save');
    sv_btn.setAttribute('id', 'table-save-btn');
    sv_btn.setAttribute('onclick', 'saveTable()');
    cl_icn.setAttribute('class', 'fas fa-times');
    cl_btn.setAttribute('id', 'table-close-btn');
    cl_btn.setAttribute('onclick', 'closeTable()');

    B.appendChild(info);
    heading_div.appendChild(B);
    sv_btn.appendChild(sv_icn);
    cl_btn.appendChild(cl_icn);
    head_div.appendChild(heading_div);
    head_div.appendChild(sv_btn);
    head_div.appendChild(cl_btn);

    mn_tab.appendChild(head_div);
  }
  var d1 = document.createElement('DIV');
  var d2 = document.createElement('DIV');
  d1.setAttribute('id', 'table-body');
  d2.setAttribute('id', 'table-really');
  d1.appendChild(d2);
  mn_tab.appendChild(d1);
  return mn_tab;
}
function closeTable() {
  document.querySelector('.main').classList.toggle("table-toggle");
  document.querySelector('.datatable').classList.toggle("table-toggle");
}
function saveTable() {
  updateTableData(clicked_crt_id, table.getData());
  document.getElementById(clicked_crt_id).parentElement.classList.remove('empty');
  console.log('savinig table');
  document.querySelector('.main').classList.toggle("table-toggle");
  document.querySelector('.datatable').classList.toggle("table-toggle");
}
function checkAllTablesAreFill(M) {
  if(M[0] === 'XXX'){
    return false;
  }
  else{
    for(var i=0;i<M[1].length; i++){
      if(!checkAllTablesAreFill(M[1][i])){
        return false;
      }
    }
    return true;
  }
}

/* ======================   Function realted to dataset and cloud ================ */
function generateTableData(A) {
  // tabledata, crt
  var x = ['XXX'];
  var ch = [];
  for(var i=0; i<A[1].length; i++){
    var p = generateTableData(A[1][i]);
    ch.push(p);
  }
  x.push(ch);
  return x;
}
function updateTableData(id, data){
  // forming matrix of data
  var mat = [];
  for(var i=0; i<data.length; i++){
    var r = [];
    var cnt=0;
    for(var item in data[i]){
      if(cnt>=2){
        r.push(data[i][item]);
      }
      cnt++;
    }
    mat.push(r);
  }
  console.log(mat);
  console.log(tabledata);
  tabledata = solve(id, mat, tabledata);
  console.log(tabledata);
}
function solve(id, M, R){
  if(id.length === 1){
    var x = [];
    x[0] = M;
    x[1] = R[1];
    return x;
  }
  else{
    var x = R;
    id = id.slice(2);
    x[1][id[0]] = solve(id, M, R[1][id[0]]);
    return x;
  }
}

/* ======================   Function to save data to cloud ================ */
function saveDataToCloud(){
  fetch("/savedataset", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify({'tabledata': tabledata, 'hierarchy_id': id, 'flag': flag}),
  })
  .then((response) => {
    if(response.status === 200 ){
      console.log("Data Saved Successfully");
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Data Saved Successfully";
      showSnackbar();
    }
    else{
      console.log("Error in Data Saving");
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Error in Data Saving";
      showSnackbar();
    }
  })
  .catch((err) => {
    console.log(err);
    console.log("Error in Data Saving");
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Error in Data Saving";
    showSnackbar();
  });
}
function computeResult() {
  if(checkAllTablesAreFill(tabledata)){
    console.log('result is computing');
    // code for calculating weights
  }
  else{
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "First fill all the Tabels";
    showSnackbar();
  }
}