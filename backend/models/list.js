const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required : false,
    default : "tmp",
  },
  timestamps : true
});

const List = mongoose.model('List', listSchema);

module.exports = List;