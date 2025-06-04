const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try{
        console.log('받은 데이터:', req.body);
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({message : 'register success'});
    }catch (err){
        res.status(400).json({ message: 'register failure', error: err });
    }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'login failure' });
    }
    res.json({ message: 'login success', user});
  } catch (err) {
    console.error('로그인 중 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;