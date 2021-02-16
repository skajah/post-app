const express = require('express');
const { Comment, create, validate } = require('../models/comment');

const router = express.Router();

const CastError = 'CastError';

router.get('/', async (req, res) => {
  const { postId } = req.query;

  try {
    if (!postId)
      return res
        .status(400)
        .send(
          'Can only retieve comments associated with a post\nSpecify "postId" in query string'
        );
    const comments = await Comment.find({ postId }).sort('-date');
    res.send(comments);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error getting comments');
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const comment = await create(req.body);
    res.send(comment);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error posting comment');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).send('Comment with that id not found');
    res.send(comment);
  } catch (ex) {
    console.log(ex.message);
    if (ex.name === CastError)
      return res.status(404).send('Post with that id not found');
    res.status(500).send(`Error deleting comment\n${ex.stack}`);
  }
});

module.exports = router;
