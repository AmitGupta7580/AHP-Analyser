const mongoose = require('mongoose');

var GlobalresultSchema = new mongoose.Schema({
    experts: Array,
    hierarchy_id: String, 
    prioriy: Array,
});

module.exports = mongoose.model('Globalresult',GlobalresultSchema);