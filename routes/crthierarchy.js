var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/crthierarchy", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
      if(userRecord.customClaims['admin']){ // decodedClaims.admin
        res.render("crthierarchy.ejs",{loggedin: true, admin: true});
      }
      else{
        res.redirect("/hierarchy");
      }
    });
  })
  .catch((error) => {
    res.redirect("/hierarchy");
  });
});

module.exports = router;