export {};
import * as express from 'express';
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/routes/v1');
const { logs, UPLOAD_LIMIT } = require('./vars');
const strategies = require('./passport');
const error = require('../api/middlewares/error');

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: `${UPLOAD_LIMIT}mb` }));
app.use(bodyParser.json({ limit: `${UPLOAD_LIMIT}mb` }));

app.use(cors());

app.use(morgan(logs));

app.use(compress());
app.use(methodOverride());

app.use(helmet());

app.use('/v1', routes);

app.use((req: any, res: express.Response, next: express.NextFunction) => {
  req.uuid = `uuid_${Math.random()}`; // use "uuid" lib
  next();
});

app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

app.use('/v1', routes);

app.use(error.converter);

app.use(error.notFound);

app.use(error.handler);

module.exports = app;
