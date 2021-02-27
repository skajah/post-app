const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const token = user.generateAuthToken();
  res.send(token);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const userObject = _.pick(req.body, [
    'username',
    'email',
    'password',
    'sex',
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

// revisit
/*
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Invalid Id');
  const user = await User.findByIdAndDelete(id).select('-password -__v');
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});
*/
module.exports = router;
