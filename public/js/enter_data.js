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

var id = window.location.search.split('=')[1];
console.log(id);

database.ref('/hierarchy/'+id).once('value').then((snapshot) => {
  var crt = snapshot.val()['hierarchy'];
  hierarchy_collection.where("id", "==", id).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      var alt = doc.data().alternative;
      console.log(crt);
      console.log(alt);
    });
  });
})
.catch((err) => {
  console.log(err.message);
  window.location.assign('/hierarchy');
});