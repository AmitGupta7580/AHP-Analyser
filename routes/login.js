const express = require('express');
const mongoose = require('mongoose');
var { firebase, admin } = require('../firebase');

const UserModel = mongoose.model('User');
var router = express.Router();
const request = require('request');

var recaptcha_secret = "6LfCgB8aAAAAAKCoI9HfSMwc_IlhOyRaYQgaBU5y";

router.get('/login/forget_password', function(req, res) {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    res.redirect('/home');
  })
  .catch((error) => {
    res.render('forget_password.ejs');
  });
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
router.post("/registerUser", (req, res) => {
  console.log("UNew User requested to register");
  var uname = req.body.username;
  var email = req.body.email;
  var provider = req.body.provider;

  admin.auth().getUserByEmail(email).then((userRecord) => {
    var uid = userRecord.uid;
    var User = new UserModel();
    User.uuid = uid;
    User.username = uname;
    User.email = email;
    User.provider = provider;
    User.admin = false;
    User.save((err, doc) => {
      if(!err){
        console.log("User Registered");
        res.send("user registered");
      }
      else{
        console.log(err);
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    });
  })
  .catch((err) => {
    var User = new UserModel();
    User.uuid = null;
    User.username = uname;
    User.email = null;
    User.provider = provider;
    User.admin = false;
    User.save((err, doc) => {
      if(!err){
        console.log("User Registered");
        res.send("user registered");
      }
      else{
        console.log(err);
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    });
  });
});

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