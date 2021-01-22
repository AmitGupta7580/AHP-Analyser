var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/about", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    res.render("about.ejs", {loggedin: true});
  })
  .catch((error) => {
    console.log(error.message);
    res.render("about.ejs", {loggedin: false});
  });
});

module.exports = router;