"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const multer = require('multer');
const { UPLOAD_LIMIT } = require('./vars');
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webm|mp4/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb({ message: 'Invalid file type' });
};
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});
const uploadMulter = multer({ storage, fileFilter, limits: { fieldSize: `${UPLOAD_LIMIT}MB` } });
module.exports = {
    upload: uploadMulter
};
