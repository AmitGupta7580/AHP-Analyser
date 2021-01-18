const mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
    author: String,
    hierarchy_id: String, 
    priority: Array,
    data: Array
});

module.exports = mongoose.model('Result',ResultSchema);