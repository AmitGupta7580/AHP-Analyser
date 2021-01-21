var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const DatasetModel = mongoose.model('Dataset');

router.get("/profile", (req, res) => {
  var isAdmin = false;
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
      if(userRecord.customClaims !== undefined){ // decodedClaims.admin
        if(userRecord.customClaims['admin']){
          isAdmin = true;
        }
      }
      UserModel.find({'uuid': decodedClaims.uid}).then((doc) => {
        DatasetModel.find({'author_id': doc[0]._id}).then((d) => {
          res.render("profile.ejs",{owner: true, loggedin: true, admin: isAdmin, email: doc[0].email, name: doc[0].username, dataset: d});
        })
        .catch((e) => {
          console.log(e.message);
          res.redirect("/login");
        });
      })
      .catch((err) => {
        console.log(err.message);
        res.redirect("/login");
      });
    });
  })
  .catch((error) => {
    console.log(error.message);
    res.redirect("/login");
  });
});

module.exports = router;