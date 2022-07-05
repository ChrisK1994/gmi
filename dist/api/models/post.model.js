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
const ModelUtils_1 = require("../../api/utils/ModelUtils");
const APIError = require('../../api/utils/APIError');
const path = require('path');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId;
const _1 = require(".");
const postSchema = new mongoose.Schema({
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    anon: { type: mongoose.Schema.Types.ObjectId, ref: 'Anon' },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: false,
        unique: false,
        trim: true,
        lowercase: true
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5000,
        trim: true
    },
    banMessage: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 256,
        trim: true
    },
    fileName: {
        type: String,
        required: false,
        trim: true
    },
    fileHidden: {
        type: Boolean,
        required: true
    },
    embed: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 64
    },
    viewId: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 64
    },
    nick: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 64
    }
}, { timestamps: true });
const ALLOWED_FIELDS = [
    'thread',
    'email',
    'title',
    'message',
    'banMessage',
    'fileName',
    'fileHidden',
    'embed',
    'viewId',
    'nick',
    'updatedAt',
    'createdAt'
];
postSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this) {
                const thread = yield _1.Thread.findOne({ viewId: this.viewId });
                if (thread) {
                    yield thread.deleteOne();
                }
                else {
                    if (this.fileName) {
                        yield Post.deleteFile(this.fileName);
                    }
                }
            }
            return next(); // normal save
        }
        catch (error) {
            return next(error);
        }
    });
});
postSchema.pre('deleteOne', { document: false, query: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletePost = yield Post.findOne(this._conditions);
            if (deletePost) {
                const thread = yield _1.Thread.findOne({ viewId: deletePost.viewId });
                if (thread) {
                    yield thread.deleteOne();
                }
                else {
                    if (deletePost.fileName) {
                        yield Post.deleteFile(deletePost.fileName);
                    }
                    const parentThread = yield _1.Thread.findById(deletePost.thread);
                    parentThread.posts = parentThread.posts.filter((postId) => postId.toString() !== deletePost._id.toString());
                    yield parentThread.save();
                }
            }
            return next(); // normal save
        }
        catch (error) {
            return next(error);
        }
    });
});
postSchema.pre('deleteMany', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield Post.find({ thread: this.thread });
            posts.forEach((post) => {
                if (post.fileName) {
                    const filePath = path.join(__dirname, `../../uploads/${post.fileName}`);
                    fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
                        if (err) {
                        }
                        else {
                            fs.unlinkSync(filePath);
                        }
                    });
                }
            });
            return next(); // normal save
        }
        catch (error) {
            return next(error);
        }
    });
});
postSchema.pre('deleteMany', { document: false, query: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield Post.find(this._conditions);
            posts.forEach((post) => {
                if (post.fileName) {
                    const filePath = path.join(__dirname, `../../uploads/${post.fileName}`);
                    fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
                        if (err) {
                        }
                        else {
                            fs.unlinkSync(filePath);
                        }
                    });
                }
            });
            return next(); // normal save
        }
        catch (error) {
            return next(error);
        }
    });
});
postSchema.method({
    transform({ query = {} } = {}) {
        return ModelUtils_1.transformData(this, query, ALLOWED_FIELDS);
    }
});
postSchema.statics = {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    post = yield this.findById(id).exec();
                }
                if (post) {
                    return post;
                }
                throw new APIError({
                    message: 'Post does not exist',
                    status: httpStatus.NOT_FOUND
                });
            }
            catch (error) {
                throw error;
            }
        });
    },
    deleteFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path.join(__dirname, `../../uploads/${fileName}`);
                fs.accessSync(filePath, fs.constants.F_OK);
                fs.unlinkSync(filePath);
            }
            catch (error) {
                throw error;
            }
        });
    },
    list({ query }, demandedFields = []) {
        const fields = [...demandedFields, ...ALLOWED_FIELDS];
        return ModelUtils_1.listData(this, query, fields);
    }
};
const Post = mongoose.model('Post', postSchema);
Post.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = Post;
