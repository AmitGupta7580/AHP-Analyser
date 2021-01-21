var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();
const mongoose = require('mongoose');

const UserModel = mongoose.model('User');
const ResultModel = mongoose.model('Result'); 
const GlobalresultModel = mongoose.model('Globalresult');

router.get("/home", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    res.render("home.ejs",{loggedin: true});
  })
  .catch((error) => {
    res.render("home.ejs",{loggedin: false});
  });
});

router.get("/home/view", (req, res) => {
  var res_id = req.query.res_id;
  const sessionCookie = req.cookies.sessionID || "";
  if(res_id === undefined || res_id === ""){
    res.redirect('/home');
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      GlobalresultModel.find({hierarchy_id: res_id}).then((doc) => {
        // res.render("data_view.ejs",{loggedin: true, admin: false, data: doc[0]});
        res.send('page under construction');
      }).catch((err) => {
        console.log(error.message);
        res.send('page under construction');
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.send('page under construction');
    });
  }
});

router.get("/home/expert/view", (req, res) => {
  var flag = req.query.own;
  var res_id = req.query.res_id;
  if(!flag){
    var doc_id = req.query.doc_id;
  }
  const sessionCookie = req.cookies.sessionID || "";
  if(!flag && (doc_id === undefined || doc_id === "")){
    console.log('here only');
    res.redirect('/home');
  }
  else if(res_id === undefined || res_id === ""){
    res.redirect('/home');
  }
  else{
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      if(!flag){
        ResultModel.find({author: doc_id, hierarchy_id: res_id}).then((doc) => {
          res.render("data_view.ejs",{loggedin: true, admin: false, data: doc[0]});
        }).catch((err) => {
          console.log(error.message);
          res.redirect('/home');
        });
      }
      else{
        UserModel.find({'uuid': decodedClaims.uid}).then((d) => {
          var doc_id = d[0]._id;
          ResultModel.find({author: doc_id, hierarchy_id: res_id}).then((doc) => {
            res.render("data_view.ejs",{loggedin: true, admin: false, data: doc[0]});
          }).catch((err) => {
            console.log(error.message);
            res.redirect('/home');
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/home');
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect('/home');
    });
  }
});

/* end-points of result section */
router.post("/saveresult", (req, res) => {
  var level = req.body.level;
  var alt_cnt = req.body.alt_cnt;
  var inconsistency = req.body.inconsistency;
  var hierarchy_name = req.body.goal;
  var data = req.body.tabledata;
  var hierarchy_id = req.body.hierarchy_id;
  var priority = req.body.priority;
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
  .then((decodedClaims) => {
    UserModel.find({'uuid': decodedClaims.uid}).then((doc) => {
      var doc_id = doc[0]._id;
      var author = doc[0].username;
      // save or updating Result to database
      ResultModel.find({'author': doc_id, 'hierarchy_id': hierarchy_id}).then((d) => {
        if(d[0] === undefined){
          // create new result and save it
          var Result = new ResultModel();
          Result.level = level;
          Result.alt_cnt = alt_cnt;
          Result.inconsistency = inconsistency.toFixed(4)*100;
          Result.hierarchy_name = hierarchy_name;
          Result.author_id = doc_id;
          Result.author = author;
          Result.hierarchy_id = hierarchy_id;
          Result.priority = priority;
          Result.data = data;
          Result.save((e, doc) => {
            if(!e){
              res.send('Result Saved');
            }
            else{
              console.log(e);
              res.status(401).send("UNAUTHORIZED REQUEST!");
            }
          });
        }
        else{
          // update here
          ResultModel.updateOne(
            {'author': doc_id, 'hierarchy_id': hierarchy_id},
            {'priority': priority, 'data': data}
          )
          .then((doc) => {
            console.log('Result Updated');
            res.send('Result Updated');
          })
          .catch((e) => {
            console.log(e);
            res.status(401).send("UNAUTHORIZED REQUEST!");
          });
        }
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