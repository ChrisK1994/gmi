"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { authorize, ADMIN } = require('../../middlewares/auth');
const fileController = require('../../controllers/file.controller');
router.route('/:fileName').delete(authorize(ADMIN), fileController.deleteFile);
module.exports = router;
