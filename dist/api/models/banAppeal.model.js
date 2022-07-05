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
const ObjectId = mongoose.Types.ObjectId;
const banAppealSchema = new mongoose.Schema({
    ban: { type: mongoose.Schema.Types.ObjectId, ref: 'Ban' },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 512,
        trim: true
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: false,
        unique: false,
        trim: true,
        lowercase: true
    },
}, { timestamps: true });
const ALLOWED_FIELDS = ['ban', 'message', 'email', 'updatedAt', 'createdAt'];
banAppealSchema.statics = {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let banAppeal;
                if (ObjectId.isValid(id)) {
                    banAppeal = yield this.findById(id).exec();
                }
                if (banAppeal) {
                    return banAppeal;
                }
                throw new APIError({
                    message: 'Ban appeal does not exist',
                    status: httpStatus.NOT_FOUND
                });
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
const BanAppeal = mongoose.model('BanAppeal', banAppealSchema);
BanAppeal.ALLOWED_FIELDS = ALLOWED_FIELDS;
module.exports = BanAppeal;
