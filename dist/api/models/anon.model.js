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
const anonSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 128,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    postingBlockedTo: {
        type: Date,
    }
}, {
    timestamps: true
});
const ALLOWED_FIELDS = ['id', 'ipAddress', 'password', 'postingDelayedTo', 'updatedAt', 'createdAt'];
anonSchema.method({
    transform({ query = {} } = {}) {
        return ModelUtils_1.transformData(this, query, ALLOWED_FIELDS);
    }
});
anonSchema.statics = {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let anon;
                if (mongoose.Types.ObjectId.isValid(id)) {
                    anon = yield this.findById(id).exec();
                }
                if (anon) {
                    return anon;
                }
                throw new APIError({
                    message: 'Anon does not exist',
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
const Anon = mongoose.model('Anon', anonSchema);
Anon.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = Anon;
