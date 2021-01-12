var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/dataset", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    if(true){ // decodedClaims.expert
      res.render("dataset.ejs", {loggedin: true, expert: true});
    }
    else{
      res.render("dataset.ejs", {loggedin: true, expert: false});
    }
  })
  .catch((error) => {
    res.render("dataset.ejs", {loggedin: false, expert: false});
  });
});

router.get("/dataset/fill", (req, res) => {
  var id = req.query.id;
  const sessionCookie = req.cookies.sessionID || "";
  if(id === undefined || id === ""){
    res.redirect('/dataset');
  }
  else{
    firebase.database().ref('/hierarchy/' + id).once('value')
    .then((snapshot) => {
      var data = snapshot.val()['hierarchy'];
      admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
          if(userRecord.customClaims !== undefined){ // decodedClaims.admin
            if(userRecord.customClaims['admin']){
              res.render("enter_data.ejs",{loggedin: true, admin: true, data: data});
            }
          }
          else{
            res.render("enter_data.ejs",{loggedin: true, admin: false, data: data});
          }
        });
      })
      .catch((error) => {
        res.redirect('/dataset');
      });
    })
    .catch((err) => {
      res.redirect('/dataset');
    });
  }
});

module.exports = router;