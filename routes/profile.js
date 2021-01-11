var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/profile", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
      console.log(userRecord);
      if(userRecord.customClaims !== undefined){ // decodedClaims.admin
        if(userRecord.customClaims['admin']){
          res.render("profile.ejs",{loggedin: true, admin: true, email: userRecord.email, name: "Admin"});
        }
      }
      else{
        res.render("profile.ejs",{loggedin: true, admin: false, email: userRecord.email, name: userRecord.displayName});
      }
    });
  })
  .catch((error) => {
    console.log(error.message);
    res.redirect("/login");
  });
});

module.exports = router;