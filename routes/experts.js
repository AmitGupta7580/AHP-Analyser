var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const DatasetModel = mongoose.model('Dataset');

router.get("/experts/view", (req, res) => {
  var id = req.query.id;
  var isAdmin = false;
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    UserModel.find({'_id': id}).then((doc) => {
      if(decodedClaims.uid === doc[0].uuid){
        res.redirect('/profile');
      }
      else{
        console.log(doc[0]._id);
        DatasetModel.find({'author_id': id}).then((d) => {
          res.render("profile.ejs",{owner: false, loggedin: true, admin: isAdmin, email: doc[0].email, name: doc[0].username, dataset: d});
        })
        .catch((e) => {
          console.log(e.message);
          res.redirect("/login");
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.redirect("/login");
    });
  })
  .catch((error) => {
    res.render("profile.ejs", {loggedin: false, expert: false});
  });
});

module.exports = router;