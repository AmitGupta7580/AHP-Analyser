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

function createHierarchy() {
  window.location.assign("/crthierarchy");
}