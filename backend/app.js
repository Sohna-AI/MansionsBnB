const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';
const routes = require('./routes');

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) app.use(cors());

app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'LAX',
      httpOnly: true,
    },
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = 'Resource Not Found';
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
    if (err.name === 'SequelizeUniqueConstraintError') {
      err.status = 500;
    } else err.status = 400;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  const error = {
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
  };
  if (!isProduction) {
    error.stack = err.stack;
  }
  res.json(error);
});

module.exports = app;
