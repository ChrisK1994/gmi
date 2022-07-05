export {};
import * as Joi from 'joi';

module.exports = {
  register: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128)
    })
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128)
    })
  },

  // POST /v1/auth/facebook
  // POST /v1/auth/google
  oAuth: {
    body: Joi.object({
      access_token: Joi.string().required()
    })
  },

  refresh: {
    body: Joi.object({
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required()
    })
  },

  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required()
    })
  }
};
