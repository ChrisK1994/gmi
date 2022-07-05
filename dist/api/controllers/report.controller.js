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
exports.loadReport = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const report = yield models_1.Report.get(id);
        if (report) {
            req.route.meta = req.route.meta || {};
            req.route.meta.report = report;
        }
        else {
            throw new APIError({
                message: 'Report does not exist',
                status: httpStatus.NOT_FOUND
            });
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.listReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const data = (yield models_1.Report.list(req)).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Report });
    }
    catch (e) {
        next(e);
    }
});
exports.getReport = (req, res) => {
    const { report } = req.route.meta;
    res.json(report.transform());
};
exports.updateReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { report } = req.route.meta;
    const changedReport = Object.assign(report, req.body);
    changedReport
        .save()
        .then((savedReport) => res.json(savedReport.transform()))
        .catch((e) => next(e));
});
exports.removeReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { report } = req.route.meta;
    report
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
});
exports.banReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { report } = req.route.meta;
    try {
        const post = yield models_1.Report.get(report.post);
        const ban = new models_1.Ban(req.body);
        ban.post = new ObjectId(post._id);
        ban.anon = new ObjectId(post.anon);
        const data = yield ban.save();
        Utils_1.apiJson({ req, res, data, model: models_1.Ban });
    }
    catch (e) {
        next(e);
    }
});
