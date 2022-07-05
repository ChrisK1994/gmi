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
const httpStatus = require('http-status');
const APIError = require('../../api/utils/APIError');
const ModelUtils_1 = require("../../api/utils/ModelUtils");
const boards = ['b', '$', 'c'];
const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: boards,
        minlength: 1,
        maxlength: 4
    },
    fullName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 128
    }
}, {
    timestamps: true
});
const ALLOWED_FIELDS = ['name', 'fullName'];
boardSchema.method({
    transform({ query = {} } = {}) {
        return ModelUtils_1.transformData(this, query, ALLOWED_FIELDS);
    }
});
boardSchema.statics = {
    boards,
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let board;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    board = yield this.findById(id).exec();
                }
                if (board) {
                    return board;
                }
                throw new APIError({
                    message: 'Board does not exist',
                    status: httpStatus.NOT_FOUND
                });
            }
            catch (error) {
                throw error;
            }
        });
    },
    list({ query }) {
        return ModelUtils_1.listData(this, query, ALLOWED_FIELDS);
    },
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find().count();
        });
    }
};
const Board = mongoose.model('Board', boardSchema);
Board.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = Board;
