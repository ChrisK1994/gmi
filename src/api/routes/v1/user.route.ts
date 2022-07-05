export {};
const express = require('express');
const { validate } = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { listUsers, createUser, replaceUser, updateUser } = require('../../validations/user.validation');

const router = express.Router();

router.param('userId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN), validate(listUsers), controller.list)
  .post(authorize(ADMIN), validate(createUser), controller.create);

router.route('/profile').get(authorize(), controller.loggedIn);

router
  .route('/:userId')
  .get(authorize(ADMIN), controller.get)
  .put(authorize(ADMIN), validate(replaceUser), controller.replace)
  .patch(authorize(ADMIN), validate(updateUser), controller.update)
  .delete(authorize(ADMIN), controller.remove);

router
  .route('/:userId/notes')
  .get(authorize(ADMIN), controller.listUserNotes)
  .post(authorize(ADMIN), controller.createNote);

router.route('/:userId/notes/:noteId').delete(authorize(ADMIN), controller.deleteUserNote);

module.exports = router;
