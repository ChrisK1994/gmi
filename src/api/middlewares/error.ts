export {};
import * as httpStatus from 'http-status';
const { ValidationError } = require('express-validation');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');

const handler = (err: any, req: any, res: any, next: any) => {
  const response = {
    code: err.status,
    message: err.message || err.status,
    errors: err.errors,
    stack: err.stack
  };

  if (env !== 'development') {
    delete response.stack;
  }

  res.status(err.status | 500);
  res.json(response);
};
exports.handler = handler;

exports.converter = (err: any, req: any, res: any, next: any) => {
  let convertedError = err;

  if (err instanceof ValidationError) {
    convertedError = new APIError({
      message: 'Validation Error',
      errors: err.errors,
      status: err.statusCode,
      stack: err.stack
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack
    });
  }

  return handler(convertedError, req, res, next);
};

exports.notFound = (req: any, res: any, next: any) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  });
  return handler(err, req, res, next);
};
