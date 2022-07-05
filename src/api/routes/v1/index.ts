export {};
import * as express from 'express';
import { apiJson } from '../../../api/utils/Utils';

const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const router = express.Router();

router.get('/status', (req, res, next) => {
  apiJson({ req, res, data: { status: 'OK' } });
  return next();
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
