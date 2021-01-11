const firebaseConfig = {
  apiKey: "AIzaSyAmHSD4qpxdjKY8wRkhbqUVvJ1lY8_aHt8",
  authDomain: "adh-analyser.firebaseapp.com",
  databaseURL: "https://adh-analyser-default-rtdb.firebaseio.com",
  projectId: "adh-analyser",
  storageBucket: "adh-analyser.appspot.com",
  messagingSenderId: "1074482678407",
  appId: "1:1074482678407:web:ee368e1e36fe4c4fcc0622",
  measurementId: "G-L3RLFF3F17"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var db = firebase.firestore();
var hierarchy_collection = db.collection("hierarchy");

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
        name: crt[0][0]
    }
  }
  chart_config.push(config);
  chart_config.push(root);
  createTreeView(root, crt[0], chart_config);
  new Treant( chart_config );
}
function closeTreeView() {
  document.querySelector('.main').classList.toggle("tree-toggle");
  document.querySelector('.tree').classList.toggle("tree-toggle");
}
function createTreeView(parent, crt, ans) {
  var i;
  for( i=1; i<crt.length; i++){
    var val = crt[i][0];
    console.log(typeof val);
    var node = {
      parent: parent,
      innerHTML: val
    };
    ans.push(node);
    createTreeView(node, crt[i], ans);
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
function getSubCriteria(node, crt){
  var ID = node.id;
  var val = node.querySelector(".hierarchy-body-node-inp").value;
  var info = [val];
  var childs = node.querySelector(".nested").childNodes;
  var cnt_child = (node.querySelector(".nested").childNodes.length);
  var i;
  for( i=1; i<cnt_child; i+=2 ){
    // var n = document.getElementById(ID+'-'+(i+1));
    var n = childs[i];
    getSubCriteria(n, info);
  }
  crt.push(info);
}
function getHierarchy(){
  // geting value of criteria
  var criteria = [];
  var goal = document.getElementById('crt-1');
  getSubCriteria(goal, criteria);
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
  crt = getHierarchy()[0];
  lvl = getLevelHierarchy(root)+2;
  
  var hierarchy = {hierarchy: crt};
  var id = makeid(32);
  var doc = { goal: crt[0], level: lvl, alternative: alt , id: id, alt_cnt: altcnt}
  console.log(id);
  hierarchy_collection.add(doc)
  .then((docRef) => {
    database.ref('hierarchy/'+id).set(hierarchy).then(() => {
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Hierarchy Saved";
      showSnackbar();
      window.location.assign("/hierarchy");
    })
    .catch((error) => {
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Noop! Some error accured Try Again";
      showSnackbar();
    });
  })
  .catch((error) => {
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Noop! Some error accured Try Again";
    showSnackbar();
  });
}

/* ======================  Utils functions  ======================== */
function showSnackbar() {
  var x = document.getElementById("sk-bar");
  x.classList.toggle("show"); 
  setTimeout(function(){ 
    x.classList.toggle("show"); 
  }, 3000);
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}