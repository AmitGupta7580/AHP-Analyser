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

module.exports = router;