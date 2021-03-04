const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const { User, validate, update } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const token = user.generateAuthToken();
  res.send(token);
});

router.patch('/me', auth, async (req, res) => {
  let { email, username, description } = req.body;
  if (email !== undefined) {
    const result = await update.email(req.user._id, email);
    if (result.error) return res.status(400).send(result.error);
    return res.send(result.email);
  }
  if (username !== undefined) {
    const result = await update.username(req.user._id, username);
    if (result.error) return res.status(400).send(result.error);
    return res.send(result.username);
  }
  if (description !== undefined) {
    const result = await update.description(req.user._id, description);
    if (result.error) return res.status(400).send(result.error);
    return res.send(result.description);
  }

  return res.send('Nothing to update');
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const userObject = _.pick(req.body, [
    'username',
    'email',
    'password',
    'description',
    'date',
    'isAdmin',
  ]);
  const { username, email } = userObject;
  const usernameExists = await User.exists({ username });
  if (usernameExists)
    return res.status(400).send(`Username already registered`);
  const emailExists = await User.exists({ email });
  if (emailExists) return res.status(400).send(`Email already registered`);

  const user = new User(userObject);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;
