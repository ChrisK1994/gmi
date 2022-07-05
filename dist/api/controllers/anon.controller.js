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
exports.loadAnon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const anonIpAddress = req.ip;
        const anon = yield models_1.Anon.findOne({ ipAddress: anonIpAddress }).exec();
        req.route.meta = req.route.meta || {};
        if (anon) {
            req.route.meta.anon = anon;
        }
        else {
            const newAnon = new models_1.Anon();
            newAnon.ipAddress = anonIpAddress;
            newAnon.password = Utils_1.randomString();
            req.route.meta.anon = yield newAnon.save();
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.loadAnonById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anonId } = req.params;
        const anon = yield models_1.Anon.get(anonId);
        req.route.meta = req.route.meta || {};
        if (anon) {
            req.route.meta.anon = anon;
        }
        else {
            throw new APIError({
                message: 'Anon does not exist',
                status: httpStatus.NOT_FOUND
            });
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.listAnons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const data = (yield models_1.Anon.list(req)).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Anon });
    }
    catch (e) {
        next(e);
    }
});
exports.getAnon = (req, res) => {
    const { anon } = req.route.meta;
    res.json(anon.transform());
};
exports.updateAnon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { anon } = req.route.meta;
    const changedAnon = Object.assign(anon, req.body);
    changedAnon
        .save()
        .then((savedAnon) => res.json(savedAnon.transform()))
        .catch((e) => next(e));
});
exports.listAnonPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const { anonId } = req.params;
        req.query = Object.assign(Object.assign({}, req.query), { anon: new ObjectId(anonId) });
        const data = (yield models_1.Post.list({ query: req.query }, ['anon'])).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Post });
    }
    catch (e) {
        next(e);
    }
});
exports.removeAnon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { anon } = req.route.meta;
    anon
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
});
