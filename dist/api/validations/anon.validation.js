"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
module.exports = {
    listAnons: {
        query: Joi.object({
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            ipAddress: Joi.string().min(6).max(128),
        })
    },
    updateAnon: {
        body: Joi.object({
            ipAddress: Joi.string().min(6).max(128),
            password: Joi.string().min(6).max(128)
        }),
        params: Joi.object({
            anonId: Joi.string()
                .regex(/^[a-fA-F0-9]{24}$/)
                .required()
        })
    }
};
