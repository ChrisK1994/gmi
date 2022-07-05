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
const moment = require("moment");
const APIError = require('../../api/utils/APIError');
exports.loadPost = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield models_1.Post.findOne({ viewId: id }).exec();
        if (post) {
            req.route.meta = req.route.meta || {};
            req.route.meta.post = post;
        }
        else {
            throw new APIError({
                message: 'Post does not exist',
                status: httpStatus.NOT_FOUND
            });
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId } = req.params;
    const { anon } = req.route.meta;
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
        const thread = yield models_1.Thread.findOne({ viewId: threadId }).exec();
        const newPost = new models_1.Post(req.body);
        newPost.thread = new ObjectId(thread._id);
        newPost.anon = new ObjectId(anon._id);
        if (file && !newPost.embed) {
            newPost.fileName = file.filename;
        }
        const postSameOwner = yield models_1.Post.findOne({ thread: thread._id, anon: anon._id }).exec();
        if (postSameOwner) {
            newPost.nick = postSameOwner.nick;
        }
        else {
            newPost.nick = Utils_1.randomString();
        }
        newPost.viewId = yield models_1.PostRecord.getNewViewId();
        const data = yield newPost.save();
        thread.posts.push(new ObjectId(data._id));
        yield thread.save();
        anon.postingBlockedTo = moment().add(30, 'seconds').toDate();
        yield anon.save();
        Utils_1.apiJson({ req, res, data, model: models_1.Post });
    }
    catch (e) {
        next(e);
    }
});
exports.listPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const { thread } = req.route.meta;
        req.query = Object.assign(Object.assign({}, req.query), { thread: new ObjectId(thread._id) });
        const data = (yield models_1.Post.list({ query: req.query })).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Post });
    }
    catch (e) {
        next(e);
    }
});
exports.deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { post } = req.route.meta;
    const { password } = req.body;
    try {
        if (password !== post.password) {
            throw new APIError({
                message: 'Wrong password',
                status: httpStatus.FORBIDDEN
            });
        }
        yield models_1.Post.deleteOne({ _id: new ObjectId(post._id) });
        Utils_1.apiJson({ req, res, data: {} });
    }
    catch (e) {
        next(e);
    }
});
exports.removePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { post } = req.route.meta;
    post
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
});
exports.updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = Object.assign(req.route.meta.post, req.body);
    post
        .save()
        .then((savedPost) => res.json(savedPost.transform()))
        .catch((e) => next());
});
exports.getPost = (req, res) => {
    const { post } = req.route.meta;
    res.json(post.transform());
};
exports.reportPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { post } = req.route.meta;
    try {
        const report = new models_1.Report(req.body);
        report.post = new ObjectId(post._id);
        const data = yield report.save();
        Utils_1.apiJson({ req, res, data, model: models_1.Report });
    }
    catch (e) {
        next(e);
    }
});
exports.banPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { post } = req.route.meta;
    try {
        const ban = new models_1.Ban(req.body);
        ban.post = new ObjectId(post._id);
        ban.anon = new ObjectId(post.anon);
        const data = yield ban.save();
        post.banMessage = data.message;
        yield post.save();
        Utils_1.apiJson({ req, res, data, model: models_1.Ban });
    }
    catch (e) {
        next(e);
    }
});
