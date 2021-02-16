const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 30,
    validate: {
      isAsync: true,
      validator: function (username, callback) {
        User.findOne({ username })
          .then((user) => callback(user === null))
          .catch((err) => `Error checking existing username: ${err.message}`);
      },
      message: (props) => `${props.value} is already taken`,
    },
  },
  email: {
    type: String,
    minlength: 8,
    maxlength: 30,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    validate: {
      isAsync: true,
      validator: function (email, callback) {
        User.findOne({ email: email })
          .then((user) => callback(user === null))
          .catch((err) => `Error checking existing email: ${err.message}`);
      },
      message: (props) => `${props.value} is already taken`,
    },
  },
  password: { type: String, minlength: 8, required: true },
  sex: {
    type: String,
    enum: ['M', 'F'],
  },
  description: String,
  date: { type: Date, default: Date.now },
  isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

async function createUser(userObject) {
  const user = new User(userObject);
  return await user.save();
}

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(8).max(30).required(),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.ref('password'),
    sex: Joi.string().valid('M', 'F').required(),
    description: Joi.string(),
    date: Joi.date().default(Date.now),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.create = createUser;
