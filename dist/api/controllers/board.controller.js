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
exports.loadBoard = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = yield models_1.Board.findOne({ name: id }).exec();
        if (board) {
            req.route.meta = req.route.meta || {};
            req.route.meta.board = board;
        }
        else {
            throw new APIError({
                message: 'Board does not exist',
                status: httpStatus.NOT_FOUND
            });
        }
        return next();
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
});
exports.getBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.json(req.route.meta.board.transform()); });
exports.createBoard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const board = new models_1.Board(req.body);
        const savedBoard = yield board.save();
        res.status(httpStatus.CREATED);
        res.json(savedBoard.transform());
    }
    catch (error) {
        next(error);
    }
});
exports.updateBoard = (req, res, next) => {
    const board = Object.assign(req.route.meta.board, req.body);
    board
        .save()
        .then((savedBoard) => res.json(savedBoard.transform()))
        .catch((e) => next());
};
exports.listBoards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Utils_1.startTimer({ req });
        const data = (yield models_1.Board.list(req)).transform(req);
        Utils_1.apiJson({ req, res, data, model: models_1.Board });
    }
    catch (e) {
        next(e);
    }
});
exports.deleteBoard = (req, res, next) => {
    const { board } = req.route.meta;
    board
        .deleteOne()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};
