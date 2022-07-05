"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { handler: errorHandler } = require('../middlewares/error');
const fs = require('fs');
const Utils_1 = require("../../api/utils/Utils");
const APIError = require('../utils/APIError');
const path = require('path');
const httpStatus = require('http-status');
exports.deleteFile = (req, res, next) => {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, `../../uploads/${fileName}`);
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        fs.unlinkSync(filePath);
        const data = { status: 'OK' };
        Utils_1.apiJson({ req, res, data });
    }
    catch (error) {
        return errorHandler(new APIError({
            message: 'File does not exist'
        }), req, res);
    }
};
