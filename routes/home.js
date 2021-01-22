var express = require('express');
var { firebase, admin } = require('../firebase');

var router = express.Router();
const mongoose = require('mongoose');

const UserModel = mongoose.model('User');
const ResultModel = mongoose.model('Result'); 
const GlobalresultModel = mongoose.model('Globalresult');
const HierarchyInfoModel = mongoose.model('HierarchyInfo');
const HierarchyModel = mongoose.model('Hierarchy');

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
                  res.send('Result Saved');
                  // var exp = [author, doc_id];
                  // var experts = q[0].experts;
                  // var priority_init = q[0].priority;
                  // var inconsistency_init = q[0].inconsistency;
                  // var idx = experts.map(JSON.stringify).indexOf(JSON.stringify(exp));
                  // if(idx == -1){
                  //   // new entry
                  //   experts.push(exp);
                  //   priority_init = updatePriority(priority_init, priority);
                  //   inconsistency_init.push(inconsistency.toFixed(4)*100);
                  //   GlobalresultModel.updateOne(
                  //     {hierarchy_id: hierarchy_id},
                  //     {priority: priority_init, experts: experts, inconsistency: inconsistency_init}
                  //   )
                  //   .then((p) => {
                  //     console.log('Global result Updated');
                  //     res.send('Result Saved');
                  //   })
                  //   .catch((l) => {
                  //     console.log(l);
                  //     res.status(401).send("UNAUTHORIZED REQUEST!");
                  //   });
                  // }
                  // else{
                  //   // update previous entry
                  //   priority_init = updatePriority(priority_init, priority);
                  //   inconsistency_init[idx] = inconsistency.toFixed(4)*100;
                  //   GlobalresultModel.updateOne(
                  //     {hierarchy_id: hierarchy_id},
                  //     {priority: priority_init, inconsistency: inconsistency_init}
                  //   )
                  //   .then((p) => {
                  //     console.log('Global result Updated');
                  //     res.send('Result Saved');
                  //   })
                  //   .catch((l) => {
                  //     console.log(l);
                  //     res.status(401).send("UNAUTHORIZED REQUEST!");
                  //   });
                  // }
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
                res.send('Result Saved');
                // var exp = [author, doc_id];
                // var experts = q[0].experts;
                // var priority_init = q[0].priority;
                // var inconsistency_init = q[0].inconsistency;
                // var idx = experts.map(JSON.stringify).indexOf(JSON.stringify(exp));
                // if(idx == -1){
                //   // new entry
                //   experts.push(exp);
                //   priority_init = updatePriority(priority_init, priority);
                //   inconsistency_init.push(inconsistency.toFixed(4)*100);
                //   GlobalresultModel.updateOne(
                //     {hierarchy_id: hierarchy_id},
                //     {priority: priority_init, experts: experts, inconsistency: inconsistency_init}
                //   )
                //   .then((p) => {
                //     console.log('Global result Updated');
                //     res.send('Result Saved');
                //   })
                //   .catch((l) => {
                //     console.log(l);
                //     res.status(401).send("UNAUTHORIZED REQUEST!");
                //   });
                // }
                // else{
                //   // update previous entry
                //   priority_init = updatePriority(priority_init, priority);
                //   inconsistency_init[idx] = inconsistency.toFixed(4)*100;
                //   GlobalresultModel.updateOne(
                //     {hierarchy_id: hierarchy_id},
                //     {priority: priority_init, inconsistency: inconsistency_init}
                //   )
                //   .then((p) => {
                //     console.log('Global result Updated');
                //     res.send('Result Saved');
                //   })
                //   .catch((l) => {
                //     console.log(l);
                //     res.status(401).send("UNAUTHORIZED REQUEST!");
                //   });
                // }
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

function updatePriority(p_ini, p) {
  var x = [];

  return x;
}

module.exports = router;