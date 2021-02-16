const mongoose = require('mongoose');
const Joi = require('joi');

function intValidator(min) {
  return {
    validator: function (v) {
      // console.log(v, typeof v);
      return Number.isInteger(v) && v >= min;
    },
    message: `Must be an integer >= ${min}`,
  };
}

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // revisit
  date: { type: Date, default: Date.now },
  text: String,
  likes: {
    type: Number,
    default: 0,
    validate: intValidator(0),
  },
  numberComments: {
    type: Number,
    default: 0,
    validate: intValidator(0),
  },
});

const Post = mongoose.model('Post', postSchema);

async function createPost(postObject) {
  const post = new Post(postObject);
  return await post.save();
}

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
exports.create = createPost;
