const mongoose = require('mongoose');

var DatasetSchema = new mongoose.Schema({
    content: Array,
    author: String,
    hierarchy_id: String
});

module.exports = mongoose.model('Dataset',DatasetSchema);