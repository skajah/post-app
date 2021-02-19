const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 30,
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 30,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
  password: { type: String, minlength: 8, required: true },
  sex: {
    type: String,
    enum: ['M', 'F'],
  },
  description: {
    type: String,
    maxlength: 3000,
  },
  date: { type: Date, default: Date.now },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(8).max(30).required(),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.ref('password'),
    sex: Joi.string().valid('M', 'F').required(),
    description: Joi.string(),
    date: Joi.date().default(Date.now),
    isAdmin: Joi.boolean().default(false),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
