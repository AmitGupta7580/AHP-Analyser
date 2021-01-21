const mongoose = require('mongoose');

var DatasetSchema = new mongoose.Schema({
    inconsistency: Number,
    content: Array,
    author: String,
    author_id: String,
    hierarchy_id: String,
    percentage: Number,
    goal: String,
});

module.exports = mongoose.model('Dataset',DatasetSchema);