const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { stream } = require('./utils/logger');
const { notFound, errorHandler } = require('./errors/handlers');
const { IS_DEV } = require('./env');

const router = require('./routes');

const app = express();

app.enable('trust proxy');

app.use(morgan(IS_DEV ? 'dev' : 'combined', { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
