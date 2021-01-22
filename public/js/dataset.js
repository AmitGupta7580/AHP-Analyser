/* ===========  Creating hierarchy and Alternative view ====================== */

function getTotalNodes(crt){
  if(crt.length>1){
    var x = 1;
    for(var i=0; i<crt[1].length; i++){
      x += getTotalNodes(crt[1][i]);
    }
    return x;
  }
  else{
    return 0;
  }
}
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

/* ======================   Dataset Tables functions  ================ */
function showTable(id) {
  clicked_crt_id = id;
  var data = getTableDataById(tabledata, id);
  document.querySelector('.main').classList.toggle("table-toggle");
  document.querySelector('.datatable').classList.toggle("table-toggle");
  var T,A;
  var val = document.getElementById(id).previousSibling.innerHTML;
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
      var incon = checkConsistency(table.getData());
      document.getElementById('inconsistency-'+clicked_crt_id).innerHTML = incon;
    },
  });
  var incon = checkConsistency(table.getData());
  document.getElementById('inconsistency-'+clicked_crt_id).innerHTML = incon;
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
      var p = JSON.parse(txt);
      ans.push(p);
    }
  }
  return ans;
}
function getColumndata(A){
  var editCheck1 = function (cell) {
    var r = A.indexOf(cell.getRow().getData().name);
    var c = parseInt(cell.getColumn().getField().slice(5));
    if(r===c){
      return false;
    }
    return true;
  }
  var editCheck2 = function (cell) {
    return false;
  }
  var ans = [];
  ans.push({title: '', field:'name', frozen:true, headerSort:false});
  for(var i=0; i<A.length; i++){
    var p = {title: A[i], field:'value'+i, editable:editCheck1, editor:"select", editorParams:{values:{"1":"1", "3":"3", "5":"5", "7":"7", "9":"9", "1/3":"1/3", "1/5":"1/5", "1/7":"1/7", "1/9":"1/9"}}, headerSort:false}
    if(viewonly){
      var p = {title: A[i], field:'value'+i, editable:editCheck2, editor:"select", editorParams:{values:{"1":"1", "3":"3", "5":"5", "7":"7", "9":"9", "1/3":"1/3", "1/5":"1/5", "1/7":"1/7", "1/9":"1/9"}}, headerSort:false}
    }
    ans.push(p);
  }
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
      <div id='Incon'>
        Inconsitency : 
        <div id="inconsistency"></div>
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
    if(!viewonly){
      head_div.appendChild(sv_btn);
    }
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
    if(!viewonly){
      head_div.appendChild(sv_btn);
    }
    head_div.appendChild(cl_btn);

    mn_tab.appendChild(head_div);
  }

  var di = document.createElement('DIV');
  var dii = document.createElement('DIV');
  var txt = document.createTextNode('Inconsitency : ');
  di.setAttribute('id', 'Incon');
  dii.setAttribute('id', 'inconsistency-'+clicked_crt_id);
  di.appendChild(txt);
  di.appendChild(dii);
  mn_tab.appendChild(di);

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
  var incon = checkConsistency(table.getData());
  if(incon > con){
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Table is Inconsistent";
    showSnackbar();
  }
  else{
    updateTableData(clicked_crt_id, table.getData());
    if(incon > max_incon){
      max_incon = incon;
    }
    document.getElementById(clicked_crt_id).parentElement.classList.remove('empty');
    document.querySelector('.main').classList.toggle("table-toggle");
    document.querySelector('.datatable').classList.toggle("table-toggle");
  }
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
  filledCrt = [];
  getEmptyCriterias(tabledata, '1');
  return fetch("/savedataset", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify({'tabledata': tabledata, 'hierarchy_id': id, 'inconsistency': max_incon, 'percentage': (filledCrt.length/total_nodes)*100, 'goal': goal}),
  })
  .then((response) => {
    if(response.status === 200 ){
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Data Uploaded Successfully";
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

/* =============   Mathematical Part of Project calculating Weights and consistency  ========== */
// require variables for cumputing result (priorities)
// tabledata, leave_nodes, getTableDataById
function computeResult() {
  if(checkAllTablesAreFill(tabledata)){
    if(max_incon <= con){
      // calculating priorities
      priority = calculatePriority();
      console.log(priority);
      if(priority !== []){
        saveDataToCloud().then(() => {
          // saving result
          document.querySelector('.main').classList.toggle("res-toggle");
          document.querySelector('.result').classList.toggle("res-toggle");
          for(var i=0; i<priority.length; i++){
            priority[i] =  priority[i].toFixed(4)*100;
          }
          
          var barChartData = {
            labels: info.alternatives,
            datasets: [{
              data: priority,
              backgroundColor: bgcolors,
              borderColor: bgborder,
              borderWidth: 1
            }]
          };
          var ctx = document.getElementById('canvas').getContext('2d');
          var mybar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
            }
          });
        });
      }
      else{
        var sk = document.getElementById("sk-bar");
        sk.innerHTML = "Some Error accured in calculating Result";
        showSnackbar();
      }
    }
    else{
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Your Data is Inconsistent";
      showSnackbar();
    }
  }
  else{
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "First fill all the Tabels";
    showSnackbar();
  }
}
function calculatePriority(){
  var leave_nodes_weights = [];
  var alt_priority = [];
  var priority = [];
  for(var i=0; i<leave_nodes.length; i++){
    leave_nodes_weights.push(calculateLeaveNodeWeight(leave_nodes[i]));
    alt_priority.push(calculateWeights(getTableDataById(tabledata, leave_nodes[i])));
  }
  var sum = 0;
  for(var i=0; i< leave_nodes_weights.length; i++){
    sum += leave_nodes_weights[i];
  }
  if(sum !== 1){
    console.log('some glitch happen');
  }
  else{
    // getting best alternative
    for(var i=0; i<leave_nodes_weights.length; i++){
      for(var j=0; j<alt.length; j++){
        alt_priority[i][j] *= leave_nodes_weights[i];
      }
    }
    for(var i=0; i<alt.length; i++){
      priority.push(0);
    }
    for(var i=0; i<leave_nodes_weights.length; i++){
      for(var j=0; j<alt.length; j++){
        priority[j] += alt_priority[i][j];
      }
    }
    var x=0;
    for(var i=0; i<priority.length; i++){
      x += priority[i];
    }
    if(x === 1){
      console.log('Resulte is computed successfully');
    }
  }
  return priority;
}
function calculateLeaveNodeWeight(id){
  if(id.length === 3){
    return calculateWeights(getTableDataById(tabledata, id.split('-')[0]))[id.split('-')[1]];
  }
  else{
    return (calculateLeaveNodeWeight(id.slice(0, id.length-2)))*calculateWeights(getTableDataById(tabledata, id.slice(0, id.length-2)))[id[id.length-1]];
  }
}
function calculate(data) {
  var w = [];
  w.push(calculateWeights(data[0]));
  var ch = [];
  if(!checkConsistency(data[0], w[0])){
    con_check = false;
  }
  for(var i=0; i<data[1].length; i++){
    ch.push(calculate(data[1][i]));
  }
  w.push(ch);
  return w;
}
function calculateWeights(M) {
  var n = M.length, weights = [], sum = [];
  for(var i=0; i<n; i++){
    sum.push(0);
    weights.push(0);
  }
  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      if(M[i][j].length > 1){
        var y = M[i][j].split('/');
        sum[j] += Number(y[0])/Number(y[1]);
      }
      else{
        sum[j] += Number(M[i][j]);
      }
    }
  }
  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      var x;
      if(M[i][j].length > 1){
        var y = M[i][j].split('/');
        x = Number(y[0])/Number(y[1]);
      }
      else{
        x = Number(M[i][j]);
      }
      weights[i] += x/sum[j];
    }
  }
  for(var i=0; i<n; i++){
    weights[i] /= n;
  }
  return weights;
}
function checkConsistency(data) {
  var M = [];
  for(var i=0; i<data.length; i++){
    var r = [];
    var cnt=0;
    for(var item in data[i]){
      if(cnt>=2){
        r.push(data[i][item]);
      }
      cnt++;
    }
    M.push(r);
  }
  var weights = calculateWeights(M);
  var n = M.length;
  var T = [];
  for(var i=0; i<n; i++){
    var p = [];
    for(var j=0; j<n; j++){
      var x;
      if(M[i][j].length > 1){
        var y = M[i][j].split('/');
        x = Number(y[0])/Number(y[1]);
      }
      else{
        x = Number(M[i][j]);
      }
      p.push(x*weights[j]);
    }
    T.push(p);
  }
  var weighted_sum = [];
  for(var i=0; i<n; i++){
    weighted_sum.push(0);
    for(var j=0; j<n; j++){
      weighted_sum[i] += T[i][j];
    }
  }
  var lamda = 0;
  for(var i=0; i<n; i++){
    weighted_sum[i] /= weights[i];
    lamda += weighted_sum[i];
  }
  lamda /= n;
  var ci = (lamda - n)/(n-1);
  var ri = randomIndex[n];
  var consistency = (ci/ri);
  if(consistency < con) {
    document.getElementById('Incon').setAttribute('style', 'color: green;')
  }
  else{
    document.getElementById('Incon').setAttribute('style', 'color: red;')
  }
  return consistency;
}

/* =====================   Result View  ================== */
function closeResultView(){
  document.querySelector('.main').classList.toggle("res-toggle");
  document.querySelector('.result').classList.toggle("res-toggle");
}
function saveResult() {
  return fetch("/saveresult", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": Cookies.get("XSRF-TOKEN"),
    },
    body: JSON.stringify({'tabledata': tabledata, 'hierarchy_id': id, 'priority': priority, 'goal': goal, 'level': lvl, 'alt_cnt': alt.length, 'inconsistency': max_incon}),
  })
  .then((response) => {
    if(response.status === 200 ){
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Priorities Saved Successfully";
      showSnackbar();
    }
    else{
      console.log("Error in Showing result");
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Error in Showing result";
      showSnackbar();
    }
  })
  .catch((err) => {
    console.log(err);
    console.log("Error in Showing result");
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Error in Showing result";
    showSnackbar();
  });
}
function viewResult() {
  document.querySelector('.main').classList.toggle("res-toggle");
  document.querySelector('.result').classList.toggle("res-toggle");
  var barChartData = {
    labels: info.alternatives,
    datasets: [{
      data: priority,
      backgroundColor: bgcolors,
      borderColor: bgborder,
      borderWidth: 1
    }]
  };
  var ctx = document.getElementById('canvas').getContext('2d');
  var mybar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
    }
  });
}