var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();
const request = require('request');

var recaptcha_secret = "6LfCgB8aAAAAAKCoI9HfSMwc_IlhOyRaYQgaBU5y";

router.get('/login/forget_password', function(req, res) {
  res.render('forget_password.ejs');
});

router.get('/login', function(req, res) {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    res.redirect('/home');
  })
  .catch((error) => {
    res.render('login.ejs');
  });
});

// end-points of authentication
router.post("/sessionLogin", (req, res) => {
  if(req.body.idToken === "" || req.body.idToken === undefined){
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
  else{
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin.auth().verifyIdToken(idToken).then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log(uid);
    })
    .catch((error) => {
      res.status(401).send("UNAUTHORIZED REQUEST!");
    })
    .then(() => {
      admin.auth().createSessionCookie(idToken, { expiresIn }).then( (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("sessionID", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      });
    })
  }
});

router.get("/sessionLogout", (req, res) => {
  res.clearCookie("sessionID");
  res.redirect("/login");
});

router.post("/verifyrecaptcha", (req, res) => {
  var recaptcha = req.body.recaptcha.toString();
  var url = "https://www.google.com/recaptcha/api/siteverify?secret="+recaptcha_secret+"&response="+recaptcha;
  var result;
  request(url, { json: true }, (err, res2, body) => {
    if (err) { return console.log(err); }
    result = res2.body['success'];
    if(!result){
      res.status(401).send("INVALID RECAPTCHA");
    }
    else{
      res.end(JSON.stringify({ status: "success" }));
    }
  })
});

module.exports = router;