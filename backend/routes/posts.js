const express = require('express');
const { Post, create, validate } = require('../models/post');
const { Comment } = require('../models/comment');

const router = express.Router();

const CastError = 'CastError';

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error getting posts');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post with that id not found');
    res.send(post);
  } catch (ex) {
    console.log(ex.message);
    if (ex.name === CastError)
      return res.status(404).send('Post with that id not found');
    res.status(500).send('Error getting post');
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const post = await create(req.body);
    res.send(post);
  } catch (ex) {
    console.log(ex.message);

    res.status(500).send('Error posting post');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) return res.status(404).send('Post with that id not found');
    // should also delete the comments associated with this post
    // perhaps make a querystring ?
    await Comment.deleteMany({ postId })
      .then(() =>
        console.log(`Successfully deleted comments by post [${postId}]`)
      )
      .catch((err) =>
        console.log(
          `Failed to delete comments by post [${postId}]\n${err.message}`
        )
      );

    // delete media associated with this post
    res.send(post);
  } catch (ex) {
    console.log(ex.message);
    if (ex.name === CastError)
      return res.status(404).send('Post with that id not found');
    res.status(500).send('Error deleting post');
  }
});

module.exports = router;
