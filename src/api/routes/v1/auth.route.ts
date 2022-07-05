export {};
const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/auth.controller');
const oAuthLogin = require('../../middlewares/auth').oAuth;
const { login, register, oAuth, refresh, forgotPassword } = require('../../validations/auth.validation');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const { upload } = require('../../../config/file');

const router = express.Router();

router.route('/register').post(upload.single('picture'), validate(register), controller.register);
router.route('/login').post(validate(login), controller.login);
router.route('/refresh-token').post(validate(refresh), controller.refresh);
router.route('/facebook').post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);
router.route('/google').post(validate(oAuth), oAuthLogin('google'), controller.oAuth);

router.route('/forgot-password').post(validate(forgotPassword), controller.forgotPassword);
router.route('/logout').post(authorize(LOGGED_USER), controller.logout);

module.exports = router;
