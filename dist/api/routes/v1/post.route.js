"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();
const { authorize, ADMIN } = require('../../middlewares/auth');
const { updatePost, deletePost, banPost, reportPost, } = require('../../validations/board.validation');
const postController = require('../../controllers/post.controller');
router.param('postId', postController.loadPost);
router
    .route('/:postId')
    .get(postController.getPost)
    .delete(validate(deletePost), postController.deletePost)
    .patch(authorize(ADMIN), validate(updatePost), postController.updatePost);
router
    .route('/:postId/ban')
    .post(authorize(ADMIN), validate(banPost), postController.banPost);
router
    .route('/:postId/report')
    .patch(authorize(ADMIN), validate(reportPost), postController.reportPost);
router.route('/admin/:postId').delete(authorize(ADMIN), postController.removePost);
module.exports = router;
