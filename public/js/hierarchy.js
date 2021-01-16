class Hierarchy {
  constructor(title, childs){
    this.title = title;
    this.childs = childs;
  }
}

var random_color = ['#69DAE0', 'rgb(255, 107, 70)', '#41F04A', '#FD57FD'];

var bx = document.getElementsByClassName('hierarchy-bx');
for(var i=0;i<bx.length; i++){
  console.log(Math.floor(((i/4)+i)%4));
  bx[i].setAttribute("style", "background-color: " + random_color[Math.floor(((i/4)+i)%4)]);
}

var view_btn = document.getElementsByClassName('hierarchy-btn-view');
for(var i=0;i<view_btn.length; i++){
  view_btn[i].addEventListener('click', (event) => {
    window.location.assign('/hierarchy/view?id='+event.path[1].id);
  });
}

var edit_btn = document.getElementsByClassName('hierarchy-btn-edit');
for(var i=0;i<edit_btn.length; i++){
  edit_btn[i].addEventListener('click', (event) => {
    window.location.assign('/dataset/fill?id='+event.path[1].id);
  });
}

/* Fetching Hierarchy lists */
// const res = fetch("/hierarchy", {
//   method: "POST",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "CSRF-Token": Cookies.get("XSRF-TOKEN"),
//   }
// });
// console.log(res);
// hierarchy_collection.get().then((querySnapshot) => {
//   var hierarchy_data = new Array();
//   querySnapshot.forEach((doc) => {
//     var data = doc.data();
//     var h = new Hierarchy(data.id, data.goal, data.level, data.alt_cnt, data.alternative);
//     hierarchy_data.push(h);
//   })
//   console.log(hierarchy_data.length);
//   var i;
//   var lst = document.getElementById('hierarchy-lst');
//   for( i=0; i<hierarchy_data.length; i+=4){
//     var rw = document.createElement("DIV");
//     rw.setAttribute("class", "hierarchy-row");
//     var j = 0;
//     while(((i+j)<hierarchy_data.length) && (j<4)){
//       // information
//       var goal = document.createTextNode(hierarchy_data[i+j].goal);
//       var no_lvl = document.createTextNode(hierarchy_data[i+j].levels + " Levels");
//       var no_alt = document.createTextNode(hierarchy_data[i+j].alt_cnt + " Alternatives");

//       // create elements
//       var br = document.createElement("BR");
//       var heading = document.createElement("H2");
//       var bx = document.createElement('DIV');
//       var info = document.createElement("P");
//       var icon = document.createElement('DIV');
//       var bt1 = document.createElement("BUTTON");
//       var bt2 = document.createElement("BUTTON");
//       var ic1 = document.createElement("I");
//       var ic2 = document.createElement("I");

//       // setting attributes
//       bx.setAttribute("class", "hierarchy-bx");
//       bx.setAttribute("style", "background-color: " + random_color[((i/4)+(i+j)%4)%4] + ";");
//       heading.setAttribute("style", "margin-top: 2vh;");
//       info.setAttribute("style", "font-size: large; margin-top: 4vh;");
//       icon.setAttribute("class", "hierarchy-icons");
//       icon.setAttribute("id", i+j);
//       bt1.setAttribute("class", "hierarchy-btn");
//       bt2.setAttribute("class", "hierarchy-btn");
//       ic1.setAttribute("class", "far fa-edit");
//       ic2.setAttribute("class", "far fa-eye");
      
//       // adding Event Listeners
//       bt1.addEventListener('click', (event) => {
//         var id = event.path[2].id;
//         window.location.assign('/dataset/fill?id='+hierarchy_data[id].id);
//       });
//       bt2.addEventListener('click', (event) => {
//         var id = event.path[2].id;
//         window.location.assign('/hierarchy/view?id='+hierarchy_data[id].id);
//       });

//       // appending childs
//       heading.appendChild(goal);
//       info.appendChild(no_lvl);
//       info.appendChild(br);
//       info.appendChild(no_alt);
//       bt1.appendChild(ic1);
//       bt2.appendChild(ic2);
//       icon.appendChild(bt1);
//       icon.appendChild(bt2);
      
//       bx.appendChild(heading);
//       bx.appendChild(info);
//       bx.appendChild(icon);
//       rw.appendChild(bx);

//       j ++;
//     }
//     lst.appendChild(rw);
//   }
// });

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

function createHierarchy() {
  window.location.assign("/crthierarchy");
}