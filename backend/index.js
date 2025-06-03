const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db');

const postRoutes = require('./routes/posts');
const Post = require('./models/Post');

const userRoutes = require('./routes/users');
const User = require('./models/User');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

connectDB().then(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});

  app.listen(5001, () => {
    console.log('cykor');
  });
}).catch((err) => {
  console.error('connection failed:', err);
});
