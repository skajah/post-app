const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      username: {
        type: String,
        minlength: 5,
        maxlength: 30,
      },
    }),
    required: true,
  },
  date: { type: Date, default: Date.now },
  text: String,
  likes: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Must be an integer >= 0',
    },
  },
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    date: Joi.date().default(Date.now),
    text: Joi.string(),
    likes: Joi.number().integer().min(0).default(0),
    numberComments: Joi.number().integer().min(0).default(0),
  });

  return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;
