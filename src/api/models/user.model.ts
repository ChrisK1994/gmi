export {};
import { NextFunction } from 'express';
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid');
const APIError = require('../../api/utils/APIError');
import { transformData, listData } from '../../api/utils/ModelUtils';
const { env, JWT_SECRET, JWT_EXPIRATION_MINUTES } = require('../../config/vars');

const roles = ['user', 'admin'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128
    },
    tempPassword: {
      type: String,
      required: false,
      minlength: 6,
      maxlength: 128
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true
    },
    services: {
      facebook: String,
      google: String
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    picture: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
const ALLOWED_FIELDS = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

userSchema.pre('save', async function save(next: NextFunction) {
  try {
    const rounds = env === 'test' ? 1 : 10;
    if (this.isModified('password')) {
      const hash = await bcrypt.hash(this.password, rounds);
      this.password = hash;
    } else if (this.isModified('tempPassword')) {
      const hash = await bcrypt.hash(this.tempPassword, rounds);
      this.tempPassword = hash;
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.method({
  transform({ query = {} }: { query?: any } = {}) {
    return transformData(this, query, ALLOWED_FIELDS);
  },

  token() {
    const playload = {
      exp: moment().add(JWT_EXPIRATION_MINUTES, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id
    };
    return jwt.encode(playload, JWT_SECRET);
  },

  async passwordMatches(password: string) {
    return bcrypt.compare(password, this.password);
  }
});

userSchema.statics = {
  roles,

  async get(id: any) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  async findAndGenerateToken(options: any) {
    const { email, password, refreshObject } = options;
    if (!email) {
      throw new APIError({ message: 'An email is required to generate a token' });
    }

    const user = await this.findOne({ email }).exec();
    const err: any = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  list({ query }: { query: any }) {
    return listData(this, query, ALLOWED_FIELDS);
  },

  checkDuplicateEmail(error: any) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [
          {
            field: 'email',
            location: 'body',
            messages: ['"email" already exists']
          }
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  },

  async oAuthLogin({ service, id, email, name, picture }: any) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) {
        user.name = name;
      }
      if (!user.picture) {
        user.picture = picture;
      }
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id },
      email,
      password,
      name,
      picture
    });
  },

  async count() {
    return this.find().count();
  }
};

const User = mongoose.model('User', userSchema);
User.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = User;
