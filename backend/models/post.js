const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required : true,
  }
  },
  {
    timestamps : true
  }
  );

const Post = mongoose.model('Post', listSchema);

module.exports = Post;