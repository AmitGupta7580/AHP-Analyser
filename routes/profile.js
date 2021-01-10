var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();

router.get("/profile", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    console.log(decodedClaims.uid);
    console.log(decodedClaims.email);
    console.log(decodedClaims.email_verified);
    console.log(decodedClaims.expert);
    // res.render('home.ejs',{name:name,user:req.user,posts:posts.reverse()});
    res.render("profile.ejs");
  })
  .catch((error) => {
    console.log(error.message);
    res.redirect("/login");
  });
});

module.exports = router;