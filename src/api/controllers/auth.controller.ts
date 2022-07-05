export {};
import { NextFunction, Request, Response, Router } from 'express';
const httpStatus = require('http-status');
import { User } from '../../api/models';
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
import { apiJson, randomString } from '../../api/utils/Utils';
import { sendEmail, forgotPasswordEmail } from '../../api/utils/MsgUtils';
const { JWT_EXPIRATION_MINUTES } = require('../../config/vars');
const s3 = require('../../config/s3');

function generateTokenResponse(user: any, accessToken: string) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(JWT_EXPIRATION_MINUTES, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn
  };
}

exports.register = async (req: any, res: Response, next: NextFunction) => {
  try {
    const newUser = new User(req.body);

    const { file } = req;

    if (file) {
      const newFileName = randomString(20);
      newUser.picture = newFileName;

      const s3Client = s3.s3Client;
      const params = s3.uploadParams;

      params.Key = newFileName;
      params.Body = file.buffer;
      params.ContentType = file.mimetype;

      await s3Client.upload(params).promise();
    }
    const savedUser = await newUser.save();
    const userTransformed = savedUser.transform();
    const token = generateTokenResponse(savedUser, savedUser.token());
    res.status(httpStatus.CREATED);
    const data = { token, user: userTransformed };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const { email } = user;
    const token = generateTokenResponse(user, accessToken);

    const userTransformed = user.transform();
    const data = { token, user: userTransformed };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req: Request, res: Response, next: NextFunction) => {
  console.log('- logout');
  try {
    const { userId } = req.body;
    await RefreshToken.findAndDeleteToken({ userId });
    const data = { status: 'OK' };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};

exports.oAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

exports.refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: reqEmail } = req.body;
    const user = await User.findOne({ email: reqEmail });
    if (!user) {
      return next({ message: 'Invalid request' });
    }
    const { name, email } = user;
    const tempPass = randomString(10, 'abcdefghijklmnopqrstuvwxyz0123456789');
    user.tempPassword = tempPass;
    await user.save();
    sendEmail(forgotPasswordEmail({ name, email, tempPass }));

    return apiJson({ req, res, data: { status: 'OK' } });
  } catch (error) {
    return next(error);
  }
};
