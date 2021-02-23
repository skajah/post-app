const _ = require('lodash');
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateId');
const { verifyUserForComment } = require('../middleware/verifyUser');
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
  const comments = await Comment.find({ postId }).select('-__v');
  res.send(comments);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const commentObject = _.pick(req.body, [
    'userId',
    'postId',
    'likes',
    'date',
    'text',
  ]);
  const postExists = await Post.exists({ _id: commentObject.postId });
  if (!postExists) return res.status(400).send('Invalid postId for comment');

  const user = await User.findById(commentObject.userId).select('_id username');
  if (!user) return res.status(400).send('Invalid userId for comment');

  commentObject.user = user;
  const comment = await new Comment(commentObject).save();

  res.send(comment);
});

router.delete(
  '/:id',
  [auth, validateId, verifyUserForComment],
  async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id).select(
      '-__v'
    );
    res.send(comment);
  }
);

module.exports = router;
