var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();
const mongoose = require('mongoose');

const UserModel = mongoose.model('User');
const ResultModel = mongoose.model('Result'); 
const GlobalresultModel = mongoose.model('Globalresult');
const HierarchyInfoModel = mongoose.model('HierarchyInfo');
const HierarchyModel = mongoose.model('Hierarchy');

router.get("/", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  GlobalresultModel.find((err, doc) => {
    if(!err){
      admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        res.render("home.ejs",{loggedin: true, data: doc});
      })
      .catch((error) => {
        res.render("home.ejs",{loggedin: false, data: doc});
      });
    }
    else{
      console.log(err);
      res.status(500).send("Internal server error");
    }
  });
});

router.get("/home", (req, res) => {
  const sessionCookie = req.cookies.sessionID || "";
  GlobalresultModel.find((err, doc) => {
    if(!err){
      admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then((decodedClaims) => {
        res.render("home.ejs",{loggedin: true, data: doc});
      })
      .catch((error) => {
        res.render("home.ejs",{loggedin: false, data: doc});
      });
    }
    else{
      console.log(err);
      res.status(500).send("Internal server error");
    }
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
      GlobalresultModel.find({_id: res_id}).then((globalresult) => {
        HierarchyInfoModel.find({hierarchy_id: globalresult[0].hierarchy_id}).then((hierarchyinfo) => {
          HierarchyModel.find({_id: globalresult[0].hierarchy_id}).then((hierarchydata) => {
            res.render("globalresult_view.ejs",{loggedin: true, res: globalresult[0], alt: hierarchyinfo[0].alternatives, crt: hierarchydata[0].content});
          })
          .catch((p) => {
            console.log(p.message);
            res.redirect('/home');
          });
        })
        .catch((e) => {
          console.log(e.message);
          res.redirect('/home');
        });
      }).catch((err) => {
        console.log(err.message);
        res.redirect('/home');
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect('/home');
    });
  }
});

/* end-points of result section */
router.post("/saveresult", (req, res) => {
  console.log("request for save result");
  var level = req.body.level;
  var alt_cnt = req.body.alt_cnt;
  var inconsistency = req.body.inconsistency;
  var hierarchy_name = req.body.goal;
  var data = req.body.tabledata;
  var hierarchy_id = req.body.hierarchy_id;
  var priority = req.body.priority;
  const sessionCookie = req.cookies.sessionID || "";
  admin.auth().verifySessionCookie(sessionCookie, true /* checkRevoked */)
  .then((decodedClaims) => {
    UserModel.find({'uuid': decodedClaims.uid}).then((document) => {
      var doc_id = document[0]._id;
      var author = document[0].username;
      // save or updating Result to database
      ResultModel.find({'author_id': doc_id, 'hierarchy_id': hierarchy_id}).then((d) => {
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
              console.log('result saved');
              GlobalresultModel.find({hierarchy_id: hierarchy_id}).then((q) => {
                if(q[0] === undefined){
                  var Globalresult = new GlobalresultModel();
                  Globalresult.datasets = [data];
                  Globalresult.hierarchy_id = hierarchy_id;
                  Globalresult.hierarchy_name = hierarchy_name;
                  Globalresult.level = level;
                  Globalresult.alt_cnt = alt_cnt;
                  Globalresult.inconsistency = [inconsistency.toFixed(4)*100];
                  Globalresult.priority = priority;
                  Globalresult.experts = [[author, doc_id]];
                  Globalresult.save((p, l) => {
                    if(!p){
                      console.log('Global result Created');
                      res.send('Result Saved');
                    }
                    else{
                      console.log(p);
                      res.status(401).send("UNAUTHORIZED REQUEST!");
                    }
                  });
                }
                else{
                  var dataset = data;
                  var datasets = q[0].datasets;
                  var exp = [author, doc_id];
                  var experts = q[0].experts;
                  var priority_init = [];
                  var inconsistency_init = q[0].inconsistency;
                  for(var i=0;i<alt_cnt; i++){
                    priority_init.push(0);
                  }
                  var idx = experts.map(JSON.stringify).indexOf(JSON.stringify(exp));
                  if(idx === -1){
                    // new entry
                    experts.push(exp);
                    datasets.push(dataset);
                    displayData(datasets, datasets.length);
                    var x = calculateNewData(datasets, datasets.length);
                    calculatePriority(x, priority_init, 1);
                    for(var i=0;i<priority_init.length; i++){
                      priority_init[i] = priority_init[i].toFixed(4)*100
                    }
                    inconsistency_init.push(inconsistency.toFixed(4)*100);
                    GlobalresultModel.updateOne(
                      {hierarchy_id: hierarchy_id},
                      {datasets: datasets, priority: priority_init, experts: experts, inconsistency: inconsistency_init}
                    )
                    .then((p) => {
                      console.log('Global result Updated');
                      res.send('Result Saved');
                    })
                    .catch((l) => {
                      console.log(l);
                      res.status(401).send("UNAUTHORIZED REQUEST!");
                    });
                  }
                  else{
                    // update previous entry
                    var x = calculateNewData(datasets, datasets.length);
                    calculatePriority(x, priority_init, 1);
                    for(var i=0;i<priority_init.length; i++){
                      priority_init[i] = priority_init[i].toFixed(4)*100
                    }
                    inconsistency_init[idx] = inconsistency.toFixed(4)*100;
                    GlobalresultModel.updateOne(
                      {hierarchy_id: hierarchy_id},
                      {datasets: datasets, priority: priority_init, inconsistency: inconsistency_init}
                    )
                    .then((p) => {
                      console.log('Global result Updated');
                      res.send('Result Saved');
                    })
                    .catch((l) => {
                      console.log(l);
                      res.status(401).send("UNAUTHORIZED REQUEST!");
                    });
                  }
                }
              })
              .catch((w) => {
                console.log(e);
                res.status(401).send("UNAUTHORIZED REQUEST!");
              });
            }
            else{
              console.log(e);
              res.status(401).send("UNAUTHORIZED REQUEST!");
            }
          })
        }
        else{
          // update here
          ResultModel.updateOne(
            {'author_id': doc_id, 'hierarchy_id': hierarchy_id},
            {'priority': priority, 'data': data, 'inconsistency': inconsistency.toFixed(4)*100}
          )
          .then((doc) => {
            console.log('Result Updated');
            GlobalresultModel.find({hierarchy_id: hierarchy_id}).then((q) => {
              if(q[0] === undefined){
                var Globalresult = new GlobalresultModel();
                Globalresult.datasets = [data];
                Globalresult.hierarchy_id = hierarchy_id;
                Globalresult.hierarchy_name = hierarchy_name;
                Globalresult.level = level;
                Globalresult.alt_cnt = alt_cnt;
                Globalresult.inconsistency = [inconsistency.toFixed(4)*100];
                Globalresult.priority = priority;
                Globalresult.experts = [[author, doc_id]];
                Globalresult.save((p, l) => {
                  if(!p){
                    console.log('Global result Created');
                    res.send('Result Saved');
                  }
                  else{
                    console.log(p);
                    res.status(401).send("UNAUTHORIZED REQUEST!");
                  }
                });
              }
              else{
                var dataset = data;
                var datasets = q[0].datasets;
                var exp = [author, doc_id];
                var experts = q[0].experts;
                var priority_init = [];
                var inconsistency_init = q[0].inconsistency;
                for(var i=0;i<alt_cnt; i++){
                  priority_init.push(0);
                }
                var idx = experts.map(JSON.stringify).indexOf(JSON.stringify(exp));
                if(idx === -1){
                  // new entry
                  experts.push(exp);
                  datasets.push(dataset);
                  var x = calculateNewData(datasets, datasets.length);
                  calculatePriority(x, priority_init, 1);
                  for(var i=0;i<priority_init.length; i++){
                    priority_init[i] = priority_init[i].toFixed(4)*100
                  }
                  inconsistency_init.push(inconsistency.toFixed(4)*100);
                  GlobalresultModel.updateOne(
                    {hierarchy_id: hierarchy_id},
                    {datasets: datasets, priority: priority_init, experts: experts, inconsistency: inconsistency_init}
                  )
                  .then((p) => {
                    console.log('Global result Updated');
                    res.send('Result Saved');
                  })
                  .catch((l) => {
                    console.log(l);
                    res.status(401).send("UNAUTHORIZED REQUEST!");
                  });
                }
                else{
                  // update previous entry
                  var x = calculateNewData(datasets, datasets.length);
                  calculatePriority(x, priority_init, 1);
                  for(var i=0;i<priority_init.length; i++){
                    priority_init[i] = priority_init[i].toFixed(4)*100
                  }
                  inconsistency_init[idx] = inconsistency.toFixed(4)*100;
                  GlobalresultModel.updateOne(
                    {hierarchy_id: hierarchy_id},
                    {datasets: datasets, priority: priority_init, inconsistency: inconsistency_init}
                  )
                  .then((p) => {
                    console.log('Global result Updated');
                    res.send('Result Saved');
                  })
                  .catch((l) => {
                    console.log(l);
                    res.status(401).send("UNAUTHORIZED REQUEST!");
                  });
                }
              }
            })
            .catch((w) => {
              console.log(w);
              res.status(401).send("UNAUTHORIZED REQUEST!");
            });
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

function calculateNewData(data, n) {
  if(data[0][0] !== undefined){
    var mat = [];
    for(var j=0;j<data[0][0].length; j++){
      var x = [];
      for(var k=0;k<data[0][0][0].length; k++){
        x.push(1);
      }
      mat.push(x);
    }
    for(var j=0;j<data[0][0].length; j++){
      for(var k=0;k<data[0][0][0].length; k++){
        for(var i=0;i<n;i++){
          if(data[i][0][j][k].length > 1){
            var y = data[i][0][j][k].split('/');
            mat[j][k] *= Number(y[0])/Number(y[1]);
          }
          else{
            mat[j][k] *= Number(data[i][0][j][k]);
          }
        }
        mat[j][k] = Math.pow(mat[j][k], 1/n);
      }
    }
    var ans = [mat];
    var ch = [];
    for(var i=0;i<data[0][1].length; i++){
      var newdata = [];
      for(var j=0;j<n;j++){
        newdata.push(data[j][1][i]);
      }
      ch.push(calculateNewData(newdata, n));
    }
    ans.push(ch);
    return ans;
  }
}
function calculatePriority(data, p, x) {
  var sum = [], weights = [];
  for(var i=0;i<data[0].length; i++){
    sum.push(0);
    weights.push(0);
  }
  for(var i=0;i<data[0].length; i++){
    for(var j=0;j<data[0][0].length; j++){
      sum[j] += data[0][i][j];
    }
  }
  for(var i=0;i<data[0].length; i++){
    for(var j=0;j<data[0][0].length; j++){
      weights[i] += data[0][i][j]/sum[j];
    }
  }
  for(var i=0;i<data[0].length; i++){
    weights[i] /= data[0].length;
    weights[i] *= x;
  }
  if(data[1].length === 0){
    for(var i=0;i<p.length; i++){
      p[i] += weights[i];
    }
    // leave node
  }
  else{
    for(var i=0;i<data[1].length; i++){
      calculatePriority(data[1][i], p, weights[i]);
    }
  }
}

module.exports = router;