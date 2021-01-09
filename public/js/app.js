function createnewhirarchy(){
  loop:
  while(true){
    var goal = prompt("Enter Your Goal");
    switch (goal){
      case "":
        alert("Please enter a valid Goal");
        break;
      case null:
        break loop;
      default:
        window.location.href = url+'?goal='+goal;
        break loop;
    }
  }
}
