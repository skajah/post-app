const express = require('express');
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');

const router = express.Router();

// Should not be able to get all users at once?
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Invalid Id');
  const user = await User.findById(id).select('-password');
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  const { username, email } = req.body;
  if (error) return res.status(400).send(error.details[0].message);
  const usernameExists = await User.exists({ username });
  if (usernameExists)
    return res.status(400).send(`username: ${username} already exists`);
  const emailExists = await User.exists({ email });
  if (emailExists)
    return res.status(400).send(`email: ${email} already exists`);

  const user = await new User(req.body).save();
  res.send(user);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Invalid Id');
  const user = await User.findByIdAndDelete(id).select('-password');
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

module.exports = router;
