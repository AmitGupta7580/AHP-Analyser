const mongoose = require('mongoose');

var HierarchyInfoSchema = new mongoose.Schema({
    goal: String,
    level: Number,
    alt_cnt: Number,
    hierarchy_id: String,
    consistency: Number,
    alternatives:[
      {
        type: String
      }
    ]
});

module.exports = mongoose.model('HierarchyInfo',HierarchyInfoSchema);