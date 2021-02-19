const mongoose = require('mongoose');
const express = require('express');
const comments = require('./routes/comments');
const posts = require('./routes/posts');
const users = require('./routes/users');
const cors = require('cors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

mongoose
  .connect('mongodb://localhost/post-app')
  .then(() => console.log('Connected to "post-app" db...'))
  .catch((err) => console.log('Error in connecting: ', err.message));

const app = express();

app.use(express.json());
app.use(cors());

// Comment routes
app.use('/api/comments', comments);
app.use('/api/posts', posts);
app.use('/api/users', users);

app.listen(4000, () => {
  console.log('Listening on port 4000...');
});
