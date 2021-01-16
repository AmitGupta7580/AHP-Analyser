const mongoose = require('mongoose');

var HierarchySchema = new mongoose.Schema({
    content: Array
});

module.exports = mongoose.model('Hierarchy',HierarchySchema);