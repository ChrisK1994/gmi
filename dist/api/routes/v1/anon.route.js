"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { validate } = require('express-validation');
const anonController = require('../../controllers/anon.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { listAnons, updateAnon } = require('../../validations/anon.validation');
const router = express.Router();
router.param('anonId', anonController.loadAnonById);
router.route('/').get(authorize(ADMIN), validate(listAnons), anonController.listAnons);
router
    .route('/:anonId')
    .get(authorize(ADMIN), anonController.getAnon)
    .patch(authorize(ADMIN), validate(updateAnon), anonController.updateAnon)
    .delete(authorize(ADMIN), anonController.removeAnon);
router.route('/:anonId/posts').get(authorize(ADMIN), anonController.listAnonPosts);
module.exports = router;
