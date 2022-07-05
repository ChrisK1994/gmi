"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Utils_1 = require("../../../api/utils/Utils");
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const boardRoutes = require('./board.route');
const anonRoutes = require('./anon.route');
const threaddRoutes = require('./thread.route');
const postRoutes = require('./post.route');
const banRoutes = require('./ban.route');
const reportRoutes = require('./report.route');
const fileRoutes = require('./file.route');
const router = express.Router();
/**
 * GET v1/status
 */
router.get('/status', (req, res, next) => {
    Utils_1.apiJson({ req, res, data: { status: 'OK' } });
    return next();
});
router.use('/docs', express.static('docs'));
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/board', boardRoutes);
router.use('/thread', threaddRoutes);
router.use('/post', postRoutes);
router.use('/anon', anonRoutes);
router.use('/ban', banRoutes);
router.use('/report', reportRoutes);
router.use('/file', fileRoutes);
module.exports = router;
