"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
module.exports = {
    listReports: {
        query: Joi.object({
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
        })
    },
    updateReport: {
        body: Joi.object({
            reason: Joi.string().max(256),
        })
    },
    banReport: {
        body: Joi.object({
            expirationDate: Joi.date().required(),
            message: Joi.string().min(1).max(512).required(),
        })
    },
};
