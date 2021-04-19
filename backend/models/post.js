const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('./user');

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

async function getPosts(maxDate, limit) {
  return await Post.find({
    date: { $lt: maxDate },
  })
    .limit(limit)
    .select('-__v')
    .sort('-date');
}

async function filterByUserId(userId, maxDate, limit) {
  return await Post.find({
    'user._id': userId,
    date: { $lt: maxDate },
  })
    .limit(limit)
    .select('-__v')
    .sort('-date');
}

async function filterByUsername(username, maxDate, limit) {
  return await Post.find({
    'user.username': {
      $regex: username,
      $options: 'i',
    },
    date: { $lt: maxDate },
  })
    .limit(limit)
    .select('-__v')
    .sort('-date');
}

async function filterByDateRange(start, end, maxDate, limit) {
  return await Post.find({
    date: { $gte: start, $lt: end },
  })
    .and({ date: { $lt: maxDate } })
    .limit(limit)
    .select('-__v')
    .sort('-date');
}

async function filterByDaysAgo(days, maxDate, limit) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(now);

  if (days === 0) now.setDate(now.getDate() + 1);

  start.setDate(start.getDate() - days);

  return await filterByDateRange(start, now, maxDate, limit);
}

async function filterByLikedPosts(userId, maxDate, limit) {
  const user = await User.findById(userId).select('likedPosts');
  const likedPosts = Array.from(user.likedPosts.keys());
  return await Post.find({
    _id: { $in: likedPosts },
    date: { $lt: maxDate },
  })
    .limit(limit)
    .select('-__v')
    .sort('-date');
}

async function filterByFollowing(userId, maxDate, limit) {
  const user = await User.findById(userId).select('following');
  const following = Array.from(user.following.keys());
  return await Post.find({
    'user._id': { $in: following },
    date: { $lt: maxDate },
  })
    .limit(limit)
    .select('-__v')
    .sort('-date');
}

async function filterPosts(filter, filterData, maxDate, limit) {
  const result = {};

  if (!filter) {
    result.value = await getPosts(maxDate, limit);
  } else if (!filterData) {
    result.error = '"filterData" is required';
    return result;
  } else if (filter === 'username') {
    result.value = await filterByUsername(filterData, maxDate, limit);
  } else if (filter === 'likedPosts') {
    if (!mongoose.Types.ObjectId.isValid(filterData)) {
      result.error = 'Invalid userId';
      return result;
    }
    const user = await User.exists({ _id: filterData });
    if (!user) {
      result.error = 'Invalid userId';
      return result;
    }
    result.value = await filterByLikedPosts(filterData, maxDate, limit);
  } else if (filter === 'following') {
    if (!mongoose.Types.ObjectId.isValid(filterData)) {
      result.error = 'Invalid userId';
      return result;
    }
    const user = await User.exists({ _id: filterData });
    if (!user) {
      result.error = 'Invalid userId';
      return result;
    }
    result.value = await filterByFollowing(filterData, maxDate, limit);
  } else if (filter === 'userId') {
    if (!mongoose.Types.ObjectId.isValid(filterData)) {
      result.error = 'Invalid userId';
      return result;
    }
    const user = await User.exists({ _id: filterData });
    if (!user) {
      result.error = 'Invalid userId';
      return result;
    }
    result.value = await filterByUserId(filterData, maxDate, limit);
  } else if (filter === 'daysAgo') {
    const days = parseInt(filterData);
    if (isNaN(days) || days < 0) {
      result.error = '"filterData" must an integer >= 0';
      return result;
    }
    result.value = await filterByDaysAgo(days, maxDate, limit);
  } else if (filter === 'dateRange') {
    const parts = filterData.split(',');
    if (parts.length !== 2) {
      result.error =
        'Must specify start and end dates separated by a comma.\nEx: filterData=start,end';
      return result;
    }

    let [start, end] = parts;
    start = new Date(start);
    end = new Date(end);

    if (
      !(
        start.toString() !== 'Invalid Date' && end.toString() !== 'Invalid Date'
      )
    ) {
      result.error = 'Invalid start and/or end date';
      return result;
    }

    end.setDate(end.getDate() + 1);

    result.value = await filterByDateRange(start, end, maxDate, limit);
  } else {
    result.error = 'Invalid filter';
  }
  return result;
}

exports.Post = Post;
exports.validate = validatePost;
exports.filterPosts = filterPosts;
