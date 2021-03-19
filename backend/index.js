const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/db')();
require('./startup/routes')(app);

app.listen(4000, () => {
  winston.info('Listening on port 4000...');
});
