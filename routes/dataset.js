var express = require('express');
var { firebase, admin } = require('../firebase');

const mongoose = require('mongoose');
var router = express.Router();
const UserModel = mongoose.model('User');
const HierarchyModel = mongoose.model('Hierarchy');
const HierarchyInfoModel = mongoose.model('HierarchyInfo');
const DatasetModel = mongoose.model('Dataset');
const ResultModel = mongoose.model('Result'); 

router.get("/dataset", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  ResultModel.find((err, doc) => {
    if(!err){
      var data = doc;
      admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        admin.auth().getUser(decodedClaims.uid).then((userRecord) => {
          if(userRecord.customClaims !== undefined){ // decodedClaims.admin
            if(userRecord.customClaims['admin']){
              res.render("dataset.ejs", {loggedin: true, expert: true, data: data});
            }
          }
          else{
            res.render("dataset.ejs", {loggedin: true, expert: false, data: data});
          }
        });
      })
      .catch((error) => {
        res.render("dataset.ejs", {loggedin: false, expert: false, data: data});
      });
    }
    else{
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  });
});

router.get("/dataset/fill", (req, res) => {
  var id = req.query.id;
  const sessionCookie = req.cookies.sessionID || "";
  if(id === undefined || id === ""){
    res.redirect('/dataset');
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      HierarchyModel.find({_id: id}).then((doc) => {
        HierarchyInfoModel.find({hierarchy_id: id}).then((d) => {
          UserModel.find({'uuid': decodedClaims.uid}).then((r) => {
            var author_name = r[0].username;
            DatasetModel.find({'author': author_name, 'hierarchy_id': id}).then((f) => {
              if(f.length === 0){
                res.render("enter_data.ejs",{loggedin: true, admin: false, crt: doc[0].content, info: d[0], get: false});
              }
              else{
                res.render("enter_data.ejs",{loggedin: true, admin: false, crt: doc[0].content, info: d[0], data: f[0].content, get: true, inconsistency: f[0].inconsistency});
              }
            })
            .catch((b) => {
              console.log(b);
              res.redirect('/dataset');
            });
          })
          .catch((a) => {
            console.log(a);
            res.redirect('/dataset');
          });
        })
        .catch((e) => {
          console.log(error.message);
          res.redirect('/dataset');
        })
      }).catch((err) => {
        console.log(error.message);
        res.redirect('/dataset');
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect('/dataset');
    });
  }
});

router.get("/dataset/view", (req, res) => {
  var res_id = req.query.id;
  const sessionCookie = req.cookies.sessionID || "";
  if(res_id === undefined || res_id === ""){
    res.redirect('/dataset');
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      ResultModel.find({_id: res_id}).then((document) => {
        var data = document[0];
        var id = data.hierarchy_id;
        HierarchyModel.find({_id: id}).then((doc) => {
          HierarchyInfoModel.find({hierarchy_id: id}).then((d) => {
            res.render("data_view.ejs",{loggedin: true, crt: doc[0].content, info: d[0], get: true, data: data});
          })
          .catch((e) => {
            console.log(error.message);
            res.redirect('/dataset');
          })
        }).catch((err) => {
          console.log(error.message);
          res.redirect('/dataset');
        });
      })
      .catch((err) => {
        console.log(error.message);
        res.redirect('/dataset');
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect('/dataset');
    });
  }
});

/* end-points of dataset section */
router.post("/savedataset", (req, res) => {
  var inconsistency = req.body.inconsistency;
  var tabledata = req.body.tabledata;
  var hierarchy_id = req.body.hierarchy_id;
  var flag = req.body.flag;
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    UserModel.find({'uuid': decodedClaims.uid}).then((doc) => {
      var author_name = doc[0].username;
      // save or updating Dataset to database
      if(flag){
        DatasetModel.update(
          {'author': author_name, 'hierarchy_id': hierarchy_id},
          {'content': tabledata, 'inconsistency': inconsistency}
        )
        .then((doc) => {
          res.send('Dataset Updated');
        })
        .catch((e) => {
          console.log(e);
          res.status(401).send("UNAUTHORIZED REQUEST!");
        });
      }
      else{
        var Dataset = new DatasetModel();
        Dataset.inconsistency = inconsistency;
        Dataset.content = tabledata;
        Dataset.author = author_name;
        Dataset.hierarchy_id = hierarchy_id;
        Dataset.save((e, doc) => {
          if(!e){
            res.send('Dataset Saved');
          }
          else{
            console.log(e);
            res.status(401).send("UNAUTHORIZED REQUEST!");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send("UNAUTHORIZED REQUEST!");
    });
  })
  .catch((error) => {
    console.log(error.message);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  });
});

module.exports = router;