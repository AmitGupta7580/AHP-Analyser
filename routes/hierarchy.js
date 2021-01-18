var express = require('express');
var { firebase, admin } = require('../firebase');
const mongoose = require('mongoose');

var router = express.Router();
const HierarchyInfoModel = mongoose.model('HierarchyInfo');
const HierarchyModel = mongoose.model('Hierarchy');

router.get("/hierarchy", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  HierarchyInfoModel.find((err, doc) => {
    if(!err){
      var data = doc;
      admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
          if(userRecord.customClaims !== undefined){ // decodedClaims.admin
            if(userRecord.customClaims['admin']){
              res.render("hierarchy.ejs",{loggedin: true, admin: true, data: data});
            }
          }
          else{
            res.render("hierarchy.ejs",{loggedin: true, admin: false, data: data});
          }
        });
      })
      .catch((error) => {
        res.render("hierarchy.ejs",{loggedin: false, admin: false, data: data});
      });
    }
    else{
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  });
});

router.get("/hierarchy/view", (req, res) => {
  var id = req.query.id;
  const sessionCookie = req.cookies.sessionID || "";
  if(id === undefined || id === ""){
    res.redirect('/hierarchy');
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
      HierarchyModel.find({_id: id}).then((doc) => {
        res.render("hierarchy_view.ejs",{loggedin: true, admin: true, data: doc[0].content});
      })
      .catch((err) => {
        console.log(err.message);
        res.redirect('/hierarchy');
      })
    })
    .catch((error) => {
      HierarchyModel.find({_id: id}).then((doc) => {
        res.render("hierarchy_view.ejs",{loggedin: false, admin: false, data: doc[0].content});
      })
      .catch((err) => {
        console.log(err.message);
        res.redirect('/hierarchy');
      })
    });
  }
});

module.exports = router;