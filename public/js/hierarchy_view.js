var id = window.location.search.split('=')[1];

fetch("/gethierarchy", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
  },
  body: JSON.stringify({ id }),
})
.then(function(response) {
  return response.json();
})
.then(function(data) {
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
        name: data[0]
    }
  }
  chart_config.push(config);
  chart_config.push(root);
  createTreeView(root, data[1], chart_config);
  new Treant( chart_config );
})
.catch(function(error) {
  window.location.assign('/hierarchy');
});

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