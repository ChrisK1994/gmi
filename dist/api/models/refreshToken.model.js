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
const crypto = require("crypto");
const mongoose = require('mongoose');
// const crypto = require('crypto');
const moment = require('moment-timezone');
const APIError = require('../../api/utils/APIError');
const httpStatus = require('http-status');
/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: 'String',
        ref: 'User',
        required: true
    },
    expires: { type: Date }
});
refreshTokenSchema.statics = {
    /**
     * Generate a refresh token object and saves it into the database
     *
     * @param {User} user
     * @returns {RefreshToken}
     */
    generate(user) {
        const userId = user._id;
        const userEmail = user.email;
        const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
        const expires = moment().add(30, 'days').toDate();
        const tokenObject = new RefreshToken({
            token,
            userId,
            userEmail,
            expires
        });
        tokenObject.save();
        return tokenObject;
    },
    /**
     * Find user by user ID then delete token record from DB.
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    findAndDeleteToken(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = options;
            if (!userId) {
                throw new APIError({ message: 'An userId is required to delete a token' });
            }
            const tokenRec = yield this.findOne({ userId: new mongoose.Types.ObjectId(userId) }).exec();
            const err = {
                status: httpStatus.UNAUTHORIZED,
                isPublic: true
            };
            if (tokenRec) {
                yield this.deleteOne({ userId: new mongoose.Types.ObjectId(userId) });
                return { status: 'OK' };
            }
            else {
                err.message = 'Logout failed. User already logged out?';
            }
            throw new APIError(err);
        });
    }
};
/**
 * @typedef RefreshToken
 */
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
