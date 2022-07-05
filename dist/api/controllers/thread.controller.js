"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');
const models_1 = require("../../api/models");
const Utils_1 = require("../../api/utils/Utils");
const { handler: errorHandler } = require('../middlewares/error');
const APIError = require('../../api/utils/APIError');
const moment = require("moment");
exports.loadThread = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thread = yield models_1.Thread.findOne({ viewId: id }).exec();
        if (thread) {
            req.route.meta = req.route.meta || {};
            req.route.meta.thread = thread;
        }
        else {
            throw new APIError({
                message: 'Thread does not exist',
                status: httpStatus.NOT_FOUND
            });
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.createThread = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { board, anon } = req.route.meta;
    const { file } = req;
    try {
        const lastBan = yield models_1.Ban.findOne({ anon: new ObjectId(anon._id) }).sort({ createdAt: -1 });
        if (lastBan && moment(lastBan.expirationDate).isSameOrAfter(moment(new Date()), 'second')) {
            throw new APIError({
                message: 'Zostałeś zbanowany.',
                status: httpStatus.UNAUTHORIZED
            });
        }
        if (anon.postingBlockedTo && moment(anon.postingBlockedTo).isSameOrAfter(moment(new Date()), 'second')) {
            throw new APIError({
                message: 'Musisz odczekać.',
                status: httpStatus.UNAUTHORIZED
            });
        }
        const viewId = yield models_1.PostRecord.getNewViewId();
        const newThread = new models_1.Thread();
        newThread.board = new ObjectId(board._id);
        newThread.viewId = viewId;
        newThread.sticked = false;
        const savedThread = yield newThread.save();
        const newPost = new models_1.Post(req.body);
        newPost.thread = new ObjectId(savedThread._id);
        newPost.anon = new ObjectId(anon._id);
        if (file && !newPost.embed) {
            newPost.fileName = file.filename;
        }
        newPost.viewId = viewId;
        newPost.nick = 'OP';
        const savedPost = yield newPost.save();
        savedThread.posts.push(new ObjectId(savedPost._id));
        yield savedThread.save();
        anon.postingBlockedTo = moment().add(30, 'seconds').toDate();
        yield anon.save();
        res.status(httpStatus.CREATED);
        res.json(savedThread.transform());
    }
    catch (error) {
        next(error);
    }
});
exports.listThreads = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const { board } = req.route.meta;
        req.query = Object.assign(Object.assign({}, req.query), { board: new ObjectId(board._id) });
        const data = (yield models_1.Thread.list({ query: req.query })).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Thread });
    }
    catch (e) {
        next(e);
    }
});
exports.getThread = (req, res) => {
    const { thread } = req.route.meta;
    res.json(thread.transform());
};
exports.deleteThread = (req, res, next) => {
    const { thread } = req.route.meta;
    thread
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
