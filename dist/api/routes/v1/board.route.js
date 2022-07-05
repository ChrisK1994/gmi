"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();
const { authorize, ADMIN } = require('../../middlewares/auth');
const { createThread, listThreads, createBoard, updateBoard } = require('../../validations/board.validation');
const { upload } = require('../../../config/file');
const boardController = require('../../controllers/board.controller');
const threadController = require('../../controllers/thread.controller');
const anonController = require('../../controllers/anon.controller');
router.param('boardId', anonController.loadAnon);
router.param('boardId', boardController.loadBoard);
router
    .route('/')
    .get(boardController.listBoards)
    .post(authorize(ADMIN), validate(createBoard), boardController.createBoard);
router
    .route('/:boardId')
    .delete(authorize(ADMIN), boardController.deleteBoard)
    .get(boardController.getBoard)
    .patch(authorize(ADMIN), validate(updateBoard), boardController.updateBoard);
router
    .route('/:boardId/thread')
    .get(validate(listThreads), threadController.listThreads)
    .post(upload.single('file'), validate(createThread), threadController.createThread);
module.exports = router;
