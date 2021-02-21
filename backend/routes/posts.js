const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const { Post, validate } = require('../models/post');
const { Comment } = require('../models/comment');
const { User } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
  const { numberOfComments } = req.query;
  const posts = await Post.find().sort('-date');
  if (numberOfComments === 'true') {
    // TODO
  }
  res.send(posts);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Invalid Id');
  let post = await Post.findById(id).select('-__v');
  if (!post) return res.status(404).send('Post not found');
  const { withComments } = req.query;

  if (withComments === 'true') {
    post = post.toJSON();
    const comments = await Comment.find({ postId: id });
    post.comments = comments;
  }
  res.send(post);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const postObject = _.pick(req.body, ['userId', 'date', 'text', 'likes']);
  const user = await User.findById(postObject.userId).select('_id username');
  if (!user) res.status(400).send('Invalid userId for post');
  postObject.user = user;
  const post = await new Post(postObject).save();
  res.send(post);
});

router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(400).send('Invalid Id');
  const post = await Post.findByIdAndDelete(postId);
  if (!post) return res.status(404).send('Post not found');

  Comment.deleteMany({ postId })
    .then()
    .catch((err) =>
      console.log(
        `Failed to delete post [${postId}]'s comments\n${err.message}`
      )
    );
  res.send(post);
});

module.exports = router;
