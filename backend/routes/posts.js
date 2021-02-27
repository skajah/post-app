const _ = require('lodash');
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateId');
const validateLikeDelta = require('../middleware/validateLikeDelta');
const { verifyUserForPost } = require('../middleware/verifyUser');
const express = require('express');
const { Post, validate } = require('../models/post');
const { Comment } = require('../models/comment');
const { User, likePost } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
  const { numberOfComments } = req.query;
  const posts = await Post.find().select('-__v').sort('-date');
  if (numberOfComments !== 'true') return res.send(posts);

  const commentCount = new Map();
  const comments = await Comment.find().select('postId');

  comments.forEach((c) => {
    const id = c.postId.toString();
    const prevCount = commentCount.get(id) || 0;
    commentCount.set(id, prevCount + 1);
  });

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i].toJSON();
    post._id = post._id.toString();
    post.numberOfComments = commentCount.get(post._id);
    posts[i] = post;
  }
  res.send(posts);
});

router.get('/:id', validateId, async (req, res) => {
  const { id } = req.params;

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

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const postObject = _.pick(req.body, ['userId', 'date', 'text', 'likes']);
  const user = await User.findById(postObject.userId).select('_id username');
  if (!user) res.status(400).send('Invalid userId for post');
  postObject.user = user;
  const post = await new Post(postObject).save();
  res.send(post);
});

router.patch(
  '/:id',
  [auth, validateId, validateLikeDelta],
  async (req, res) => {
    const { likeDelta } = req;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');

    if (likeDelta === -1 && post.likes === 0)
      return res.status(400).send("Can't unlike a post with 0 likes");
    post.likes += likeDelta;
    await post.save();
    likePost(req.user._id, req.params.id, likeDelta === 1);

    res.send(post);
  }
);

router.delete(
  '/:id',
  [auth, validateId, verifyUserForPost],
  async (req, res) => {
    const postId = req.params.id;

    post = await Post.findByIdAndDelete(postId);

    Comment.deleteMany({ postId })
      .then()
      .catch((err) =>
        console.log(
          `Failed to delete post [${postId}]'s comments\n${err.message}`
        )
      );

    res.send(post);
  }
);

module.exports = router;
