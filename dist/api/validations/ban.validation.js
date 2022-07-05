"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
module.exports = {
    listBans: {
        query: Joi.object({
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
        })
    },
    listAppeals: {
        query: Joi.object({
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
        })
    },
    createAppeal: {
        body: Joi.object({
            message: Joi.string().min(1).max(512).required(),
            email: Joi.string().email(),
        })
    },
    updateBan: {
        body: Joi.object({
            message: Joi.string().min(1).max(512),
            expirationDate: Joi.date(),
        })
    },
    updateAppeal: {
        body: Joi.object({
            message: Joi.string().min(1).max(512).required(),
            email: Joi.string().email(),
        })
    },
};
