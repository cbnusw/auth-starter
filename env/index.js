const { join } = require('path');
require('dotenv').config();

const { env } = process;

module.exports = {
  ROOT_DIR: join(__dirname, '..'),
  IS_DEV: env.NODE_ENV === 'development',
  ...env,
};
