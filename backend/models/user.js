const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const { Post } = require('./post');
const { Comment } = require('./comment');
const { func } = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 255,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    unique: true,
    required: true,
  },
  password: { type: String, minlength: 8, maxlength: 1024, required: true },
  description: {
    type: String,
    maxlength: 3000,
  },
  date: { type: Date, default: Date.now },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  likedPosts: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  likedComments: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  profilePic: String,
  followers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  following: {
    type: Map,
    of: Number,
    default: new Map(),
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    config.get('jwtPrivateKey')
  );
  return token;
};

userSchema.methods.getProperties = function (properties) {
  return _.pick(this, properties);
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    email: Joi.string().email().min(8).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    description: Joi.string().max(3000),
    date: Joi.date().default(Date.now),
    isAdmin: Joi.boolean().default(false),
  });

  return schema.validate(user);
}

async function likePost(userId, postId, liked) {
  const user = await User.findById(userId);
  if (liked) user.likedPosts.set(postId, 1);
  else user.likedPosts.delete(postId);
  await user.save();
}

async function likeComment(userId, commentId, liked) {
  const user = await User.findById(userId);
  if (liked) user.likedComments.set(commentId, 1);
  else user.likedComments.delete(commentId);
  await user.save();
}

async function updateEmail(userId, email) {
  email = email.trim();
  let result = {};
  const schema = Joi.object({
    email: Joi.string().email().min(8).max(255).required(),
  });
  const error = schema.validate({ email }).error;
  if (error) {
    result.error = error.details[0].message;
    return result;
  }
  const user = await User.findById(userId).select('email');
  if (user.email === email) {
    result.error = 'New email should not be the same as old';
    return result;
  }
  const emailTaken = await User.exists({ email });
  if (emailTaken) {
    result.error = 'Email already taken';
    return result;
  }
  await User.findByIdAndUpdate(userId, { email });
  result.value = email;
  return result;
}

async function updateUsername(userId, username) {
  username = username.trim();
  let result = {};
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
  });
  const error = schema.validate({ username }).error;
  if (error) {
    result.error = error.details[0].message;
    return result;
  }
  const user = await User.findById(userId).select('username');
  if (user.username === username) {
    result.error = 'New username should not be the same as old';
    return result;
  }
  const emailTaken = await User.exists({ username });
  if (emailTaken) {
    result.error = 'Username already taken';
    return result;
  }
  await User.findByIdAndUpdate(userId, { username });
  await Post.updateMany({ 'user._id': userId }, { 'user.username': username });
  await Comment.updateMany(
    { 'user._id': userId },
    { 'user.username': username }
  );

  result.value = username;
  return result;
}

async function updateDescription(userId, description) {
  description = description.trim();
  let result = {};
  const schema = Joi.object({
    description: Joi.string().allow('').max(3000),
  });
  const error = schema.validate({ description }).error;
  if (error) {
    result.error = error.details[0].message;
    return result;
  }
  await User.findByIdAndUpdate(userId, { description });
  result.value = description;
  return result;
}

async function updatePassword(userId, password) {
  let result = {};
  const schema = Joi.object({
    password: Joi.string().min(8).max(255).required(),
  });
  const error = schema.validate({ password }).error;
  if (error) {
    result.error = error.details[0].message;
    return result;
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  await User.findByIdAndUpdate(userId, { password: hashed });
  return result;
}

async function updateProfilePic(userId, profilePic) {
  let result = {};
  const schema = Joi.object({
    profilePic: Joi.string().required(),
  });
  const error = schema.validate({ profilePic }).error;
  if (error) {
    result.error = error.details[0].message;
    return result;
  }
  await User.findByIdAndUpdate(userId, { profilePic });
  await Post.updateMany(
    { 'user._id': userId },
    { 'user.profilePic': profilePic }
  );
  await Comment.updateMany(
    { 'user._id': userId },
    { 'user.profilePic': profilePic }
  );
  result.value = profilePic;
  return result;
}

async function updateFollowing(userId, following) {
  const result = {};
  const user = await User.findById(userId).select('following');
  const followedUser = await User.findById(following.id).select('followers');
  if (!followedUser) {
    result.error = "Cannot follow/unfollow a user that doesn't exist";
    return result;
  }
  if (following.follow === true) {
    user.following.set(following.id, 1);
    followedUser.followers.set(userId, 1);
    result.value = 'Following';
  } else if (following.follow === false) {
    user.following.delete(following.id);
    followedUser.followers.delete(userId);
    result.value = 'Unfollowed';
  } else {
    result.error = '"following" must be true or false';
    return result;
  }
  await user.save();
  await followedUser.save();
  return result;
}

exports.User = User;
exports.validate = validateUser;
exports.likePost = likePost;
exports.likeComment = likeComment;
exports.update = {
  email: updateEmail,
  username: updateUsername,
  description: updateDescription,
  password: updatePassword,
  profilePic: updateProfilePic,
  following: updateFollowing,
};
