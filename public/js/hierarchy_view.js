var id = window.location.search.split('=')[1];

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