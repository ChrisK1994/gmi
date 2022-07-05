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
const httpStatus = require('http-status');
const passport = require('passport');
const models_1 = require("../../api/models");
const APIError = require('../utils/APIError');
const util = require('util');
const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';
const handleJWT = (req, res, next, roles) => (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
    const error = err || info;
    const logIn = util.promisify(req.logIn);
    const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined
    });
    try {
        if (error || !user) {
            throw error;
        }
        yield logIn(user, { session: false });
    }
    catch (e) {
        return next(apiError);
    }
    if (roles === LOGGED_USER) {
        if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
            apiError.status = httpStatus.FORBIDDEN;
            apiError.message = 'Forbidden';
            return next(apiError);
        }
    }
    else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN;
        apiError.message = 'Forbidden';
        return next(apiError);
    }
    else if (err || !user) {
        return next(apiError);
    }
    req.route.meta = req.route.meta || {};
    req.route.meta.user = user;
    return next();
});
exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
exports.authorize = (roles = models_1.User.roles) => (req, res, next) => passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles))(req, res, next);
exports.oAuth = (service) => passport.authenticate(service, { session: false });
