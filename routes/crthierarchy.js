var express = require('express');
const mongoose = require('mongoose');
var { firebase, admin } = require('../firebase');

var router = express.Router();

const UserModel = mongoose.model('User');
const HierarchyInfoModel = mongoose.model('HierarchyInfo');
const HierarchyModel = mongoose.model('Hierarchy');

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

/* save hierarchy end-point */
router.post("/savehierarchy", (req, res) => {
  var info = req.body.info;
  var hierarchy = req.body.hierarchy;
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
      if(userRecord.customClaims !== undefined){ // decodedClaims.admin
        if(userRecord.customClaims['admin']){
          var HierarchyInfo = new HierarchyInfoModel();
          HierarchyInfo.goal = info.goal;
          HierarchyInfo.level = info.level;
          HierarchyInfo.alt_cnt = info.alt_cnt;
          HierarchyInfo.consistency = info.consistency;
          HierarchyInfo.alternatives = info.alternative;
          var H = castObject(hierarchy);
          var Hierarchy = new HierarchyModel();
          Hierarchy.content = H;
          Hierarchy.save((err, doc) => {
            if(!err){
              HierarchyInfo.hierarchy_id = doc.id;
              HierarchyInfo.save((e, d) => {
                if(!e){
                  console.log("Hierarchy Saved");
                  res.send('Hierarchy Saved');
                }
                else{
                  console.log(e);
                  res.status(401).send("UNAUTHORIZED REQUEST!");
                }
              });
            }
            else{
              console.log(err);
              res.status(401).send("UNAUTHORIZED REQUEST!");
            }
          });
        }
      }
      else{
        console.log("not admin");
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    });
  })
  .catch((error) => {
    console.log(error.message);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  });
});

function castObject(h) {
  var child = [],i;
  for( i=0; i<h.childs.length; i++){
    child.push(castObject(h.childs[i]));
  }
  var H = [];
  H.push(h.title);
  H.push(child);
  return H;
}

module.exports = router;