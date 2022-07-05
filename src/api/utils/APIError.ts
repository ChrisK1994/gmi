export {};
const httpStatus = require('http-status');

class ExtendableError extends Error {
  errors: any;
  status: any;
  isPublic: any;
  isOperational: any;

  constructor({ message, errors, status, isPublic, stack }: any) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
  }
}

class APIError extends ExtendableError {
  constructor({ message, errors, stack, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false }: any) {
    super({
      message,
      errors,
      status,
      isPublic,
      stack
    });
  }
}

module.exports = APIError;
