const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const { User, validate, update } = require('../models/user');
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateId');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  let { properties } = req.query;
  if (!properties)
    return res
      .status(400)
      .send(
        'Must specify "properties" as a comma separated list in query string'
      );
  properties = properties.split(',');
  const me = (await User.findById(req.user._id)).getProperties(properties);
  res.send(me);
});

router.get('/:id', validateId, async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '_id username profilePic'
  );
  if (!user) return res.status(400).send('User not found');
  res.send(user);
});

router.get('/:id/following', validateId, async (req, res) => {
  const user = await User.findById(req.params.id).select('following');
  if (!user) return res.status(400).send('User not found');
  const userFollowing = [...user.following.keys()];
  const following = await User.find({ _id: { $in: userFollowing } }).select(
    '_id username profilePic'
  );
  res.send(following);
});

router.get('/:id/followers', validateId, async (req, res) => {
  const user = await User.findById(req.params.id).select('followers');
  if (!user) return res.status(400).send('User not found');
  const userFollowers = [...user.followers.keys()];
  const followers = await User.find({ _id: { $in: userFollowers } }).select(
    '_id username profilePic'
  );
  res.send(followers);
});

router.patch('/me', auth, async (req, res) => {
  let {
    email,
    username,
    description,
    password,
    profilePic,
    following,
  } = req.body;
  let result;
  const id = req.user._id;

  if (email !== undefined) result = await update.email(id, email);
  else if (username !== undefined) result = await update.username(id, username);
  else if (description !== undefined)
    result = await update.description(id, description);
  else if (password !== undefined) result = await update.password(id, password);
  else if (profilePic !== undefined)
    result = await update.profilePic(id, profilePic);
  else if (following != undefined)
    result = await update.following(id, following);

  if (result.error) return res.status(400).send(result.error);

  if (result) {
    if (password !== undefined) result.value = 'Password Changed';
    const token = (await User.findById(id)).generateAuthToken();
    return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send(result.value);
  }
  res.status(400).send('No data given to update');
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const userObject = _.pick(req.body, [
    'username',
    'email',
    'password',
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
