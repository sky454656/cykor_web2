const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// 전체 목록 조회
router.get('/', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// 생성
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
});

// 삭제
router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// 수정
router.put('/:id', async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});


module.exports = router;
