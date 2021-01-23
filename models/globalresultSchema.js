const mongoose = require('mongoose');

var GlobalresultSchema = new mongoose.Schema({
    datasets: Array,
    experts: Array,
    priority: Array,
    level: Number,
    alt_cnt: Number,
    inconsistency: Array,
    hierarchy_name: String,
    hierarchy_id: String,
});

module.exports = mongoose.model('Globalresult',GlobalresultSchema);