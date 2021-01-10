var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/about", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    if(true){ // decodedClaims.expert
      res.render("about.ejs", {loggedin: true, expert: true});
    }
    else{
      res.render("about.ejs", {loggedin: true, expert: false});
    }
  })
  .catch((error) => {
    res.render("about.ejs", {loggedin: false, expert: false});
  });
});

module.exports = router;