const express = require("express");
const cors = require('cors');
const connectDB = require('./db');
const postRoutes = require('./routes/posts');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);

app.listen(5001, ()=>{
    console.log("cykor");


})