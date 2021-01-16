class Hierarchy {
  constructor(title, childs){
    this.title = title;
    this.childs = childs;
  }
}

var selected_elem = document.getElementById('crt-1');
var altcnt = 4;
selected_elem.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: red");
addToggleListner();
createAlt();

/* ====================  Front end part  ======================= */
function addToggleListner() {
  var elem = document.getElementsByClassName('caret');
  var i;
  for (i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function() {
      this.querySelector(".fas").classList.toggle("fa-angle-right");
      this.parentElement.querySelector(".nested").classList.toggle("active");
      selected_elem.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: rgb(138, 138, 196);");
      this.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: red;");
      selected_elem = this.parentElement;
    });
  }
}
function addCriteria(){
  var br = document.createElement('BR');
  var ID = selected_elem.id;
  var x = ID.slice(4);
  var c = ((selected_elem.querySelector('.nested').childNodes.length)/2)+1;
  var temp = getHierarchyNode(x+"-"+c);
  try {
    selected_elem.childNodes[5].appendChild(br);
    selected_elem.childNodes[5].appendChild(temp);
  }
  catch(err) {
    selected_elem.childNodes[2].appendChild(br);
    selected_elem.childNodes[2].appendChild(temp);
  }
}
function getHierarchyNode(id){
  /*
    <li id="crt-$id">
      <span class="caret">
        <button class="hierarchy-body-node-btn"><i class="fas fa-angle-down" style="font-size: large;"></i></button>
      </span>
      <input class="hierarchy-body-node-inp" name="1" type="text" value="Criteria">
      <ul class="nested active"><br></ul>
    </li>
  */
  var l = document.createElement('LI');
  l.setAttribute("id", "crt-"+id);
  var sp = document.createElement('SPAN');
  sp.setAttribute("class", "caret");
  var btn = document.createElement('BUTTON');
  btn.setAttribute("class", "hierarchy-body-node-btn");
  var icon = document.createElement('I');
  icon.setAttribute("class", "fas fa-angle-down fa-angle-right");
  icon.setAttribute("style", "font-size: large;");
  btn.appendChild(icon);
  sp.appendChild(btn);
  var inp = document.createElement('INPUT');
  inp.setAttribute("class", "hierarchy-body-node-inp");
  inp.setAttribute("name", "crt-"+id);
  inp.setAttribute("type", "text");
  inp.setAttribute("value", "Criteria");
  var u = document.createElement('UL');
  u.setAttribute("class", "nested");
  sp.addEventListener("click", function() {
    console.log(this.childNodes);
    this.childNodes[0].querySelector(".fas").classList.toggle("fa-angle-right");
    this.parentElement.querySelector(".nested").classList.toggle("active");
    selected_elem.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: rgb(138, 138, 196);");
    this.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: red;");
    selected_elem = this.parentElement;
  });
  var br = document.createElement('BR');
  l.appendChild(sp);
  l.appendChild(inp);
  l.appendChild(u);
  return l;
}
function delCriteria() {
  selected_elem.parentElement.removeChild(selected_elem.previousElementSibling);
  var elem = selected_elem;
  console.log(elem.previousSibling);
  if(elem.parentElement.childNodes.length > 3){
    try{
      selected_elem = elem.previousSibling;
      selected_elem.querySelector(".fas").classList.toggle("fa-angle-right");
      selected_elem.querySelector(".nested").classList.toggle("active");
    }
    catch (exp){
      selected_elem = elem.parentElement.parentElement;
    }
  }
  else{
    selected_elem = elem.parentElement.parentElement;
  }
  elem.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: rgb(138, 138, 196);");
  selected_elem.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: red;");
  elem.parentElement.removeChild(elem);
}
function addAlt() {
  altcnt += 1;
  createAlt();
}
function rmvAlt() {
  if(altcnt != 0){
    altcnt -= 1;
  }
  createAlt();
}
function createAlt(){
  var elem = document.getElementById("alternative-body-list");
  var n = (elem.childNodes.length)/2;
  var i;
  if( n<altcnt ){
    for(i = 0 ;i<(altcnt-n); i++) {
      var t = getAltNode(n+i);
      var br = document.createElement('BR');
      elem.appendChild(t);
      elem.appendChild(br);
    }
  }
  else{
    i = 0;
    var child = elem.lastElementChild;  
    while (child && i<(n-altcnt)) {
      i ++;
      elem.removeChild(child); 
      child = elem.lastElementChild; 
      elem.removeChild(child); 
      child = elem.lastElementChild; 
    } 
  }
}
function getAltNode(id){
  /*
  <li>
    <div id="alternative-body-node">
      <input class="alternative-body-node-inp" name="1" type="text" value="Alternative">
    </div>
  </li>
  <br>
   */
  var l = document.createElement('LI');
  var d =document.createElement('DIV');
  d.setAttribute("id", "alternative-body-node-"+id);
  var i = document.createElement('INPUT');
  i.setAttribute("class", "alternative-body-node-inp");
  i.setAttribute("type", "text");
  i.setAttribute("value", "Alternative " + (id+1));
  d.appendChild(i);
  l.appendChild(d);
  return l;
}

/* =====================  Tree View  ========================== */
function showTreeView() {
  document.querySelector('.main').classList.toggle("tree-toggle");
  document.querySelector('.tree').classList.toggle("tree-toggle");
  var crt = getHierarchy();
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
        name: crt.title
    }
  }
  chart_config.push(config);
  chart_config.push(root);
  createTreeView(root, crt.childs, chart_config);
  new Treant( chart_config );
}
function closeTreeView() {
  document.querySelector('.main').classList.toggle("tree-toggle");
  document.querySelector('.tree').classList.toggle("tree-toggle");
}
function createTreeView(parent, crt, ans) {
  var i;
  for( i=0; i<crt.length; i++){
    var val = crt[i].title;
    var node = {
      parent: parent,
      innerHTML: val
    };
    ans.push(node);
    createTreeView(node, crt[i].childs, ans);
  }
}

/* ====================  Fetching the hierarchy data  =========================== */
function getAlt(){
  // geting value of alternatives
  var alternatives = [];
  var i;
  var elem = document.getElementById("alternative-body-list");
  var n = (elem.childNodes.length)/2;
  for( i=0 ; i<n; i++){
    alternatives.push(document.getElementsByClassName("alternative-body-node-inp")[i].value);
  }
  return alternatives;
}
function getSubCriteria(node){
  var val = node.querySelector(".hierarchy-body-node-inp").value;
  var childs_h = [];
  var childs = node.querySelector(".nested").childNodes;
  var cnt_child = (node.querySelector(".nested").childNodes.length);
  var i;
  for( i=1; i<cnt_child; i+=2 ){
    // var n = document.getElementById(ID+'-'+(i+1));
    var n = childs[i];
    childs_h.push(getSubCriteria(n));
  }
  var h = new Hierarchy(val, childs_h);
  return h;
}
function getHierarchy(){
  // geting value of criteria
  var goal = document.getElementById('crt-1');
  var criteria = getSubCriteria(goal);
  return criteria;
}
function getLevelHierarchy(node){
  var childs = node.querySelector(".nested").childNodes;
  var cnt_child = (childs.length);
  if(cnt_child === 0) {
    return 0;
  }
  else {
    var max = 0,i;
    for( i=1; i<cnt_child; i+=2){
      var c = getLevelHierarchy(childs[i]);
      if(c > max) {
        max = c;
      }
    }
    return (max+1);
  }
}

/* ======================   Saving Hierarchy to cloud  ======================== */
function saveHierarchy(){
  var root = document.getElementById('crt-1');
  alt = getAlt();
  crt = getHierarchy();
  lvl = getLevelHierarchy(root)+2;
  var flag = false;
  loop:
  while(true){
    var res = prompt("Maximum Consistency", "0.10");
    if(res>1 || res<0){
      alert("Please enter Consistency between 0 to 1");
    }
    else if(res === null || res === undefined){
      break loop;
    }
    else{
      flag = true;
      break loop;
    }
  }
  if(flag){
    var doc = { goal: crt.title, level: lvl, alternative: alt , alt_cnt: altcnt, consistency: res};
    fetch("/savehierarchy", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify({'info': doc, 'hierarchy': crt}),
    })
    .then((res) => {
      if(res.status !== 200 ){
        var sk = document.getElementById("sk-bar");
        sk.innerHTML = "Error in Saving Hierarchy";
        showSnackbar();
        return false;
      }
      else{
        var sk = document.getElementById("sk-bar");
        sk.innerHTML = "Hierarchy Saved Successfully";
        showSnackbar();
        return true;
      }
    })
  }
  else{
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Unable to save Hierarchy<br>You have not enterted the value of consistency. ";
    showSnackbar();
  }
}

/* ======================  Utils functions  ======================== */
function showSnackbar() {
  var x = document.getElementById("sk-bar");
  x.classList.toggle("show"); 
  setTimeout(function(){ 
    x.classList.toggle("show"); 
  }, 3000);
}