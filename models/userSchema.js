const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    uuid: {
      type: String,
      unique: true
    },
    username: String,
    email: String,
    provider: String,
    admin: Boolean
});

module.exports = mongoose.model('User',userSchema);