const mongoose = require('mongoose');

// Connecting to MongoDB.
mongoose.connect('mongodb://localhost:27017/AHP-analyser', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(!err) {
    console.log("Database connected");
  }
  else{
    console.log("Error connecting database");
  }
});

const User = require('./userSchema');
const HierarchyInfo = require('./hierarchyInfoSchema');
const Hierarchy = require('./hierarchySchema');