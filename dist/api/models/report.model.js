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
const reportSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reason: {
        type: String,
        required: false,
        maxlength: 256
    }
}, {
    timestamps: true
});
const ALLOWED_FIELDS = ['id', 'post', 'reason', 'updatedAt', 'createdAt'];
reportSchema.method({
    transform({ query = {} } = {}) {
        return ModelUtils_1.transformData(this, query, ALLOWED_FIELDS);
    }
});
reportSchema.statics = {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let report;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    report = yield this.findById(id).exec();
                }
                if (report) {
                    return report;
                }
                throw new APIError({
                    message: 'Report does not exist',
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
const Report = mongoose.model('Report', reportSchema);
Report.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = Report;
