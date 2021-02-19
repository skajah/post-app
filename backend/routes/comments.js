const express = require('express');
const { Comment, validate } = require('../models/comment');
const { Post } = require('../models/post');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
  const { postId } = req.query;
  if (!postId)
    return res
      .status(400)
      .send('Specify postId in query string to get comments');
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(400).send('Invalid Id');
  const comments = await Comment.find({ postId });
  res.send(comments);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const postExists = await Post.exists({ _id: req.body.postId });
  if (!postExists) return res.status(400).send('Invalid postId for comment');

  const user = await User.findById(req.body.userId).select('_id username');
  if (!user) return res.status(400).send('Invalid userId for comment');
  req.body.user = user;
  const comment = await new Comment(req.body).save();
  res.send(comment);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Invalid Id');
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) return res.status(404).send('Comment not found');
  res.send(comment);
});

module.exports = router;
