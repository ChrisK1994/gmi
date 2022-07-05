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
const _1 = require(".");
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../api/utils/APIError');
const ObjectId = mongoose.Types.ObjectId;
const ModelUtils_1 = require("../../api/utils/ModelUtils");
const threadSchema = new mongoose.Schema({
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    sticked: {
        type: Boolean,
        required: true,
        minlength: 6,
        maxlength: 32,
        default: false
    },
    viewId: {
        type: Number,
        required: true,
        minlength: 6,
        maxlength: 64
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, {
    timestamps: true
});
const ALLOWED_FIELDS = ['board', 'viewId', 'sticked', 'posts', 'updatedAt', 'createdAt'];
threadSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield _1.Post.deleteMany({ thread: new ObjectId(this._id) });
            return next(); // normal save
        }
        catch (error) {
            return next(error);
        }
    });
});
threadSchema.pre('deleteOne', { document: false, query: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedThread = yield Thread.findOne(this._conditions);
            yield _1.Post.deleteMany({ thread: new ObjectId(deletedThread._id) });
            return next(); // normal save
        }
        catch (error) {
            return next(error);
        }
    });
});
threadSchema.method({
    transform({ query = {} } = {}) {
        return ModelUtils_1.transformData(this, query, ALLOWED_FIELDS);
    }
});
threadSchema.statics = {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let thread;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    thread = yield this.findById(id).exec();
                }
                if (thread) {
                    return thread;
                }
                throw new APIError({
                    message: 'Thread does not exist',
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
const Thread = mongoose.model('Thread', threadSchema);
Thread.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = Thread;
