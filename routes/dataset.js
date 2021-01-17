var express = require('express');
var { firebase, admin } = require('../firebase');

const mongoose = require('mongoose');
var router = express.Router();
const UserModel = mongoose.model('User');
var HierarchyModel = mongoose.model('Hierarchy');
const DatasetModel = mongoose.model('Dataset');

router.get("/dataset", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    if(true){ // decodedClaims.expert
      res.render("dataset.ejs", {loggedin: true, expert: true});
    }
    else{
      res.render("dataset.ejs", {loggedin: true, expert: false});
    }
  })
  .catch((error) => {
    res.render("dataset.ejs", {loggedin: false, expert: false});
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
        console.log(doc[0].content);
        res.render("enter_data.ejs",{loggedin: true, admin: false, data: doc[0].content});
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

router.post("/savedataset", (req, res) => {
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
          {'content': tabledata}
        )
        .then((doc) => {
          console.log("Dataset Updated");
          res.send('Dataset Updated');
        })
        .catch((e) => {
          console.log(e);
          res.status(401).send("UNAUTHORIZED REQUEST!");
        });
      }
      else{
        var Dataset = new DatasetModel();
        Dataset.content = tabledata;
        Dataset.author = author_name;
        Dataset.hierarchy_id = hierarchy_id;
        Dataset.save((e, doc) => {
          if(!e){
            console.log("Dataset Saved");
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

router.post("/getdataset", (req, res) => {
  const hierarchy_id = req.body.id.toString();
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    UserModel.find({'uuid': decodedClaims.uid}).then((doc) => {
      var author_name = doc[0].username;
      DatasetModel.find({'author': author_name, 'hierarchy_id': hierarchy_id}).then((d) => {
        if(d.length === 0){
          res.send(['No Document Find']);
        }
        else{
          res.send(d[0].content);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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