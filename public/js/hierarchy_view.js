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

var id = window.location.search.split('=')[1];
console.log(id);

database.ref('/hierarchy/'+id).once('value')
.then((snapshot) => {
  var data = snapshot.val()['hierarchy'];
  console.log(data);
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
  createTreeView(root, data, chart_config);
  console.log(chart_config);
  new Treant( chart_config );
})
.catch((err) => {
  console.log(err.message);
  window.location.assign('/hierarchy');
});

function createTreeView(parent, crt, ans) {
  var i;
  for( i=1; i<crt.length; i++){
    var val = crt[i][0];
    var node = {
      parent: parent,
      innerHTML: val
    };
    ans.push(node);
    createTreeView(node, crt[i], ans);
  }
}