"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../api/models");
const Joi = require("joi");
const postBody = () => {
    return Joi.object({
        email: Joi.string().email(),
        title: Joi.string().min(1).max(128),
        message: Joi.string().min(2).max(5000).required(),
        fileHidden: Joi.boolean().required(),
        embed: Joi.string().min(6).max(128),
        password: Joi.string().min(6).max(128)
    });
};
module.exports = {
    createBoard: {
        body: Joi.object({
            name: Joi.string().valid(...models_1.Board.boards),
            fullName: Joi.string().min(1).max(64).required()
        })
    },
    updateBoard: {
        body: Joi.object({
            name: Joi.string().min(1).max(4),
            fullName: Joi.string().min(1).max(64)
        })
    },
    listThreads: {
        query: Joi.object({
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100),
            sort: Joi.string(),
            populate: Joi.string(),
        })
    },
    createThread: {
        body: postBody()
    },
    createPost: {
        body: postBody()
    },
    deletePost: {
        body: Joi.object({
            password: Joi.string().min(6).max(128).required()
        })
    },
    updatePost: {
        body: Joi.object({
            email: Joi.string().email(),
            title: Joi.string().min(1).max(128),
            message: Joi.string().min(2).max(5000),
            hidden: Joi.boolean(),
            embed: Joi.string().min(6).max(128),
            password: Joi.string().min(6).max(128)
        })
    },
    banPost: {
        body: Joi.object({
            expirationDate: Joi.date().required(),
            message: Joi.string().min(2).max(5000).required(),
        })
    },
    reportPost: {
        body: Joi.object({
            reason: Joi.string().max(256),
        })
    }
};
