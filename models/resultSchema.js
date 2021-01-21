const mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
    author: String,
    author_id: String,
    level: Number,
    alt_cnt: Number,
    inconsistency: Number,
    hierarchy_name: String,
    hierarchy_id: String,
    priority: Array,
    data: Array
});

module.exports = mongoose.model('Result',ResultSchema);