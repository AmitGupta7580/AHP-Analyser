require("firebase/auth");
var firebase = require('firebase')
var admin = require('firebase-admin')
var serviceAccount = require("F:\\Web Dev\\AHP-Server2\\service-account.json");

var firebaseConfig = {
  apiKey: "AIzaSyAmHSD4qpxdjKY8wRkhbqUVvJ1lY8_aHt8",
  authDomain: "adh-analyser.firebaseapp.com",
  databaseURL: "https://adh-analyser-default-rtdb.firebaseio.com",
  projectId: "adh-analyser",
  storageBucket: "adh-analyser.appspot.com",
  messagingSenderId: "1074482678407",
  appId: "1:1074482678407:web:ee368e1e36fe4c4fcc0622",
  measurementId: "G-L3RLFF3F17"
};

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adh-analyser-default-rtdb.firebaseio.com"
});
module.exports = { firebase, admin };