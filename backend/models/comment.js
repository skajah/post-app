const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
  text: { type: String, required: true, minlength: 1, maxlength: 2000 },
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

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
  const schema = Joi.object({
    postId: Joi.objectId().required().messages({
      any: '"postId" must be a valid objectId',
    }),
    userId: Joi.objectId().required(),
    date: Joi.date().default(Date.now),
    text: Joi.string().required(),
    likes: Joi.number().integer().min(0).default(0),
  });

  return schema.validate(comment);
}

exports.Comment = Comment;
exports.validate = validateComment;
