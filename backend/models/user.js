const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

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
    default: {},
  },
  likedComments: {
    type: Map,
    of: Number,
    default: {},
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      description: this.description,
      date: this.date,
      isAdmin: this.isAdmin,
      likedPosts: this.likedPosts,
      likedComments: this.likedComments,
    },
    config.get('jwtPrivateKey')
  );
  return token;
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

exports.User = User;
exports.validate = validateUser;
exports.likePost = likePost;
exports.likeComment = likeComment;
