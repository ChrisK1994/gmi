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
const postRecordSchema = new mongoose.Schema({
    viewId: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 64
    }
}, { timestamps: true });
const ALLOWED_FIELDS = ['viewId', 'updatedAt', 'createdAt'];
postRecordSchema.statics = {
    getNewViewId() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastPost = yield this.findOne().sort({ createdAt: -1 });
                const viewId = lastPost === null || lastPost === void 0 ? void 0 : lastPost.viewId;
                const newPostRecord = new PostRecord();
                if (viewId) {
                    newPostRecord.viewId = viewId + 1;
                }
                else {
                    newPostRecord.viewId = 1;
                }
                yield newPostRecord.save();
                return newPostRecord.viewId;
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
const PostRecord = mongoose.model('PostRecord', postRecordSchema);
PostRecord.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = PostRecord;
