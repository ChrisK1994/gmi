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
exports.loadBan = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ban = yield models_1.Ban.get(id);
        req.route.meta = req.route.meta || {};
        req.route.meta.ban = ban;
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.loadAppeal = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banAppeal = yield models_1.BanAppeal.get(id);
        if (banAppeal) {
            req.route.meta = req.route.meta || {};
            req.route.meta.banAppeal = banAppeal;
        }
        else {
            throw new APIError({
                message: 'Appeal does not exist',
                status: httpStatus.NOT_FOUND
            });
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.listBans = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const data = (yield models_1.Ban.list(req)).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Ban });
    }
    catch (e) {
        next(e);
    }
});
exports.listAppeals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const data = (yield models_1.BanAppeal.list(req)).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.BanAppeal });
    }
    catch (e) {
        next(e);
    }
});
exports.getBan = (req, res) => {
    const { ban } = req.route.meta;
    res.json(ban.transform());
};
exports.getAppeal = (req, res) => {
    const { banAppeal } = req.route.meta;
    res.json(banAppeal.transform());
};
exports.removeBan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ban } = req.route.meta;
    ban
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
});
exports.removeAppeal = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { banAppeal } = req.route.meta;
    banAppeal
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
});
exports.updateBan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ban } = req.route.meta;
    const changedBan = Object.assign(ban, req.body);
    changedBan
        .save()
        .then((savedBan) => res.json(savedBan.transform()))
        .catch((e) => next(e));
});
exports.updateAppeal = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { banAppeal } = req.route.meta;
    const changedAppeal = Object.assign(banAppeal, req.body);
    changedAppeal
        .save()
        .then((savedAppeal) => res.json(savedAppeal.transform()))
        .catch((e) => next(e));
});
exports.createAppeal = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ban } = req.route.meta;
    try {
        const appeal = new models_1.BanAppeal(req.body);
        appeal.ban = ban;
        const savedAppeal = yield appeal.save();
        res.status(httpStatus.CREATED);
        res.json(savedAppeal.transform());
    }
    catch (error) {
        next(error);
    }
});
