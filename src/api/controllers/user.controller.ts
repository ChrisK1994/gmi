export {};
import { NextFunction, Request, Response, Router } from 'express';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');
const { omit } = require('lodash');
import { User, UserNote } from '../../api/models';
import { startTimer, apiJson, randomString } from '../../api/utils/Utils';
const { handler: errorHandler } = require('../middlewares/error');
const s3 = require('../../config/s3');

exports.load = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const user = await User.get(id);
    req.route.meta = req.route.meta || {};
    req.route.meta.user = user;
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

const loggedIn = (req: Request, res: Response) => res.json(req.route.meta.user.transform());
exports.loggedIn = loggedIn;

exports.get = loggedIn;

exports.create = async (req: any, res: Response, next: NextFunction) => {
  try {
    const newUser = new User(req.body);
    const { picture } = req;

    if (picture) {
      const newFileName = randomString(20);
      newUser.picture = newFileName;

      const s3Client = s3.s3Client;
      const params = s3.uploadParams;

      params.Key = newFileName;
      params.Body = picture.buffer;
      params.ContentType = picture.mimetype;

      await s3Client.upload(params).promise();
    }

    const savedUser = await newUser.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

exports.replace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.route.meta;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

exports.update = (req: Request, res: Response, next: NextFunction) => {
  const ommitRole = req.route.meta.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.route.meta.user, updatedUser);

  user
    .save()
    .then((savedUser: any) => res.json(savedUser.transform()))
    .catch((e: any) => next(User.checkDuplicateEmail(e)));
};

exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer({ req });
    const data = (await User.list(req)).transform(req);
    apiJson({ req, res, data, model: User });
  } catch (e) {
    next(e);
  }
};

exports.listUserNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer({ req });
    const userId = req.params.userId;
    req.query = { ...req.query, user: new ObjectId(userId) };
    const data = (await UserNote.list({ query: req.query })).transform(req);
    apiJson({ req, res, data, model: UserNote });
  } catch (e) {
    next(e);
  }
};

exports.createNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { title, note } = req.body;
  try {
    const newNote = new UserNote({
      user: new ObjectId(userId),
      title,
      note
    });
    const data = await newNote.save();
    apiJson({ req, res, data, model: UserNote });
  } catch (e) {
    next(e);
  }
};

exports.deleteUserNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, noteId } = req.params;
  const { _id } = req.route.meta.user;
  const currentUserId = _id.toString();
  if (userId !== currentUserId) {
    return next();
  }
  try {
    await UserNote.deleteOne({ user: new ObjectId(userId), _id: new ObjectId(noteId) });
    apiJson({ req, res, data: {} });
  } catch (e) {
    next(e);
  }
};

exports.remove = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.route.meta;
  user
    .deleteOne()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: any) => next(e));
};
