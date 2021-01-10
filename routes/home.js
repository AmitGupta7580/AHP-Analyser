var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/home", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    res.render("home.ejs",{loggedin: true});
  })
  .catch((error) => {
    res.render("home.ejs",{loggedin: false});
  });
});

module.exports = router;