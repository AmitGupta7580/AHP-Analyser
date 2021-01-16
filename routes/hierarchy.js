var express = require('express');
var { firebase, admin } = require('../firebase');
const mongoose = require('mongoose');

var router = express.Router();
const HierarchyInfo = mongoose.model('HierarchyInfo');
const Hierarchy = mongoose.model('Hierarchy');

router.get("/hierarchy", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  HierarchyInfo.find((err, doc) => {
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
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
          if(userRecord.customClaims !== undefined){ // decodedClaims.admin
            if(userRecord.customClaims['admin']){
              res.render("hierarchy_view.ejs",{loggedin: true, admin: true});
            }
          }
          else{
            res.render("hierarchy_view.ejs",{loggedin: true, admin: false});
          }
        });
      })
      .catch((error) => {
        res.render("hierarchy_view.ejs",{loggedin: false, admin: false});
      });
  }
});

/* view hierarvhy end-point */
router.post("/gethierarchy", (req, res) => {
  const id = req.body.id.toString();
  const sessionCookie = req.cookies.sessionID || "";
  if(id === undefined || id === ""){
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        Hierarchy.find({_id: id}).then((doc) => {
          res.send(doc[0].content);
        })
        .catch((err) => {
          console.log(err.message);
          res.status(401).send("UNAUTHORIZED REQUEST!");
        })
      })
      .catch((error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      });
  }
});

router.post("/gethierarchyinfo", (req, res) => {
  const id = req.body.id.toString();
  const sessionCookie = req.cookies.sessionID || "";
  if(id === undefined || id === ""){
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        HierarchyInfo.find({hierarchy_id: id}).then((doc) => {
          res.send(doc[0]);
        })
        .catch((err) => {
          console.log(err.message);
          res.status(401).send("UNAUTHORIZED REQUEST!");
        })
      })
      .catch((error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      });
  }
});

module.exports = router;