var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/hierarchy", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    if(true){ // decodedClaims.admin
      res.render("hierarchy.ejs",{loggedin: true, admin: true});
    }
    else{
      res.render("hierarchy.ejs",{loggedin: true, admin: false});
    }
  })
  .catch((error) => {
    res.render("hierarchy.ejs",{loggedin: false, admin: false});
  });
});

module.exports = router;