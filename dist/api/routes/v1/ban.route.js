"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();
const { authorize, ADMIN } = require('../../middlewares/auth');
const { listBans, listAppeals, createAppeal, updateBan, updateAppeal, } = require('../../validations/ban.validation');
const banController = require('../../controllers/ban.controller');
router.param('banId', banController.loadBan);
router.param('appealId', banController.loadAppeal);
router
    .route('/')
    .get(authorize(ADMIN), validate(listBans), banController.listBans);
router
    .route('/:banId')
    .get(authorize(ADMIN), banController.getBan)
    .delete(authorize(ADMIN), banController.removeBan)
    .patch(authorize(ADMIN), validate(updateBan), banController.updateBan);
router
    .route('/:banId/appeal')
    .post(validate(createAppeal), banController.createAppeal);
router
    .route('/appeal')
    .get(authorize(ADMIN), validate(listAppeals), banController.listAppeals);
router
    .route('/appeal/:appealId')
    .get(authorize(ADMIN), banController.getAppeal)
    .delete(authorize(ADMIN), banController.removeAppeal)
    .patch(validate(updateAppeal), banController.updateAppeal);
module.exports = router;
