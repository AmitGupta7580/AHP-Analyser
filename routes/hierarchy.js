var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/hierarchy", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
      if(userRecord.customClaims !== undefined){ // decodedClaims.admin
        if(userRecord.customClaims['admin']){
          res.render("hierarchy.ejs",{loggedin: true, admin: true});
        }
      }
      else{
        res.render("hierarchy.ejs",{loggedin: true, admin: false});
      }
    });
  })
  .catch((error) => {
    res.render("hierarchy.ejs",{loggedin: false, admin: false});
  });
});

router.get("/hierarchy/view", (req, res) => {
  var id = req.query.id;
  const sessionCookie = req.cookies.sessionID || "";
  if(id === undefined || id === ""){
    res.redirect('/hierarchy');
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
              res.render("hierarchy_view.ejs",{loggedin: true, admin: true, data: data});
            }
          }
          else{
            res.render("hierarchy_view.ejs",{loggedin: true, admin: false, data: data});
          }
        });
      })
      .catch((error) => {
        res.render("hierarchy_view.ejs",{loggedin: false, admin: false, data: data});
      });
    })
    .catch((err) => {
      res.redirect('/hierarchy');
    });
  }
});

module.exports = router;