const comments = require('../routes/comments');
const posts = require('../routes/posts');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = function (app) {
  app.use('/api/comments', comments);
  app.use('/api/posts', posts);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(cors());
};
