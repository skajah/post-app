const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      username: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
      },
      profilePic: String,
    }),
    required: true,
  },
  date: { type: Date, default: Date.now },
  text: {
    type: String,
    maxlength: 3000,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Must be an integer >= 0',
    },
  },
  numberOfComments: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Must be an integer >=0',
    },
  },
  media: {
    mediaType: String,
    data: String,
  },
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    date: Joi.date().default(Date.now),
    text: Joi.string().max(3000).allow(''),
    likes: Joi.number().integer().min(0).default(0),
    numberOfComments: Joi.number().integer().min(0).default(0),
    media: Joi.object().keys({
      mediaType: Joi.string().equal('image', 'video', 'audio').required(),
      data: Joi.string().required(),
    }),
  });

  return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;
