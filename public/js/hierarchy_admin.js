var selected_elem = document.getElementById('crt-1');
selected_elem.querySelector(".hierarchy-body-node-btn").setAttribute("style", "background-color: red");
addToggleListner();
createAlt(4);
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
function changeAltCnt(val){
  createAlt(val);
}
function createAlt(cnt){
  var ul = document.getElementById('alternative-body-list');
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  var i;
  for(i = 0 ;i<cnt; i++) {
    var t = getAltNode(1);
    var br = document.createElement('BR');
    ul.appendChild(t);
    ul.appendChild(br);
  }
}
function getAltNode(n){
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
  d.setAttribute("id", "alternative-body-node");
  var i = document.createElement('INPUT');
  i.setAttribute("class", "alternative-body-node-inp");
  i.setAttribute("name", n);
  i.setAttribute("type", "text");
  i.setAttribute("value", "Alternative");
  d.appendChild(i);
  l.appendChild(d);
  return l;
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
function getSubCriteria(node, crt){
  var ID = node.id;
  var val = node.querySelector(".hierarchy-body-node-inp").value;
  var info = [val];
  var cnt_child = (node.querySelector(".nested").childNodes.length)/2;
  var i;
  for( i=0; i<cnt_child; i++ ){
    var n = document.getElementById(ID+'-'+(i+1));
    getSubCriteria(n, info);
  }
  crt.push(info);
}
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
function getHierarchy(){
  // geting value of criteria
  var criteria = [];
  var goal = document.getElementById('crt-1');
  getSubCriteria(goal, criteria);
  return criteria;
}
function saveHierarchy(){
  alt = getAlt();
  crt = getHierarchy();
  console.log(crt);
  console.log(alt);
  // let data = criteria+":"+alternatives;
  // fs.writeFile('Output.txt', data, (err) => { 
  //   if (err) throw err; 
  // }) 
}