export {};
const path = require('path');

require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
  allowEmptyValues: true
});

const env = process.env;

module.exports = {
  env: env.NODE_ENV,
  port: env.PORT || 8000,
  socketEnabled: ['1', 'true', 'yes'].indexOf(env.SOCKET_ENABLED || '') >= 0,
  emailEnabled: env.EMAIL_MAILGUN_API_KEY ? true : false,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRATION_MINUTES: env.JWT_EXPIRATION_MINUTES,
  UPLOAD_LIMIT: 10, // MB
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: env.S3_BUCKET_NAME,
  S3_REGION: env.S3_REGION,
  isAdmin: (user: any) => user && user.email === env.SEC_ADMIN_EMAIL,
  mongo: {
    uri: env.NODE_ENV === 'production' ? env.MONGO_URI_PROD : env.MONGO_URI
  },
  logs: env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
