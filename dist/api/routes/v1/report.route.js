"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { validate } = require('express-validation');
const reportController = require('../../controllers/report.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const { listReports, updateReport, banReport } = require('../../validations/report.validation');
const router = express.Router();
router.param('reportId', reportController.loadReport);
router.route('/').get(authorize(ADMIN), validate(listReports), reportController.listReports);
router
    .route('/:reportId')
    .get(authorize(ADMIN), reportController.getReport)
    .patch(authorize(ADMIN), validate(updateReport), reportController.updateReport)
    .delete(authorize(ADMIN), reportController.removeReport);
router
    .route('/:reportId/ban')
    .post(authorize(ADMIN), validate(banReport), reportController.banReport);
module.exports = router;
