"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();
const { authorize, ADMIN } = require('../../middlewares/auth');
const { upload } = require('../../../config/file');
const { createPost, } = require('../../validations/board.validation');
const threadController = require('../../controllers/thread.controller');
const postController = require('../../controllers/post.controller');
const anonController = require('../../controllers/anon.controller');
router.param('threadId', anonController.loadAnon);
router.param('threadId', threadController.loadThread);
router.route('/:threadId').get(threadController.getThread).delete(authorize(ADMIN), threadController.deleteThread);
router
    .route('/:threadId/post')
    .get(postController.listPosts)
    .post(upload.single('file'), validate(createPost), postController.createPost);
module.exports = router;
