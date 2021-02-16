const mongoose = require('mongoose');
const Joi = require('joi');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      isAsync: true,
      validator: function (id, callback) {
        Post.findOne({ _id: id })
          .then((result) => callback(result !== null))
          .catch((err) => `Error validating postId: ${err.message}`);
      },
      message: 'Must reference a valid post',
    },
  },
  userId: { type: String, required: true }, // revisit
  date: { type: Date, default: Date.now },
  text: { type: String, required: true, minlength: 1 },
  likes: {
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        // console.log(v, typeof v);
        return Number.isInteger(v) && v >= 0;
      },
      message: 'Must be an integer >= 0',
    },
  },
});

const Comment = mongoose.model('Comment', commentSchema);

async function createComment(commentObject) {
  const comment = new Comment(commentObject);
  return await comment.save();
}

function validateComment(comment) {
  const schema = Joi.object({
    postId: Joi.string().required(),
    userId: Joi.string().required(),
    date: Joi.date().default(Date.now),
    text: Joi.string().required(),
    likes: Joi.number().integer().min(0).default(0),
  });

  return schema.validate(comment);
}

exports.Comment = Comment;
exports.validate = validateComment;
exports.create = createComment;
