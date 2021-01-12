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

var db = firebase.firestore();
var hierarchy_collection = db.collection("hierarchy");

var random_color = ['#69DAE0', 'rgb(255, 107, 70)', '#41F04A', '#FD57FD'];
console.log(random_color);

/* Fetching Hierarchy lists */
hierarchy_collection.get().then((querySnapshot) => {
  var hierarchy_data = new Array();
  querySnapshot.forEach((doc) => {
    hierarchy_data.push([doc.id, doc.data()]);
  })
  console.log(hierarchy_data.length);
  var i;
  var lst = document.getElementById('hierarchy-lst');
  for( i=0; i<hierarchy_data.length; i+=4){
    var rw = document.createElement("DIV");
    rw.setAttribute("class", "hierarchy-row");
    var j = 0;
    while(((i+j)<hierarchy_data.length) && (j<4)){
      // information
      var goal = document.createTextNode(hierarchy_data[i+j][1].goal);
      var no_lvl = document.createTextNode(hierarchy_data[i+j][1].level + " Levels");
      var no_alt = document.createTextNode(hierarchy_data[i+j][1].alt_cnt + " Alternatives");
      var id = hierarchy_data[i+j][0];

      // create elements
      var br = document.createElement("BR");
      var heading = document.createElement("H2");
      var bx = document.createElement('DIV');
      var info = document.createElement("P");
      var icon = document.createElement('DIV');
      var bt1 = document.createElement("BUTTON");
      var bt2 = document.createElement("BUTTON");
      var ic1 = document.createElement("I");
      var ic2 = document.createElement("I");

      // setting attributes
      bx.setAttribute("class", "hierarchy-bx");
      bx.setAttribute("style", "background-color: " + random_color[(i+(i+j)%4)%4] + ";");
      heading.setAttribute("style", "margin-top: 2vh;");
      info.setAttribute("style", "font-size: large; margin-top: 4vh;");
      icon.setAttribute("class", "hierarchy-icons");
      icon.setAttribute("id", i+j);
      bt1.setAttribute("class", "hierarchy-btn");
      bt2.setAttribute("class", "hierarchy-btn");
      ic1.setAttribute("class", "far fa-edit");
      ic2.setAttribute("class", "far fa-eye");
      
      // adding Event Listeners
      bt1.addEventListener('click', (event) => {
        console.log("Edit : " + i+j);
        console.log("ID : " + id);
      });
      bt2.addEventListener('click', (event) => {
        console.log("View : " + i+j);
        console.log("ID : " + id);
      });

      // appending childs
      heading.appendChild(goal);
      info.appendChild(no_lvl);
      info.appendChild(br);
      info.appendChild(no_alt);
      bt1.appendChild(ic1);
      bt2.appendChild(ic2);
      icon.appendChild(bt1);
      icon.appendChild(bt2);
      
      bx.appendChild(heading);
      bx.appendChild(info);
      bx.appendChild(icon);
      rw.appendChild(bx);

      j ++;
    }
    lst.appendChild(rw);
  }
});

/*
<div class="hierarchy-bx">
  <h2 style="margin-top: 2vh;">Purchasing Phone</h2>
  <p style="font-size: large; margin-top: 4vh;">14 Levels<br>5 Alternatives</p>
  <div class="hierarchy-icons" id="1">
    <button class="hierarchy-btn" onclick=""><i class="far fa-edit"></i></button>
    <button class="hierarchy-btn" onclick=""><i class="far fa-eye"></i></button>
  </div>
</div>
*/