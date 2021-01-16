var express = require('express');
var { firebase, admin } = require('../firebase');

const mongoose = require('mongoose');
var router = express.Router();
var Hierarchy = mongoose.model('Hierarchy');

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
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      Hierarchy.find({_id: id}).then((doc) => {
        console.log(doc[0].content);
        res.render("enter_data.ejs",{loggedin: true, admin: false, data: doc[0].content});
      }).catch((err) => {
        console.log(error.message);
        res.redirect('/dataset');
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect('/dataset');
    });
  }
});

module.exports = router;