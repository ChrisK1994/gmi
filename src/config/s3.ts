const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET_NAME } = require('./vars');

const s3Client = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: S3_REGION
});

const uploadParams = {
  Bucket: S3_BUCKET_NAME,
  Key: '',
  Body: null,
  ContentType: null,
  ContentDisposition: 'inline',
  ACL: 'public-read'
};

const deleteParams = {
  Bucket: S3_BUCKET_NAME,
  Key: ''
};

const getParams = {
  Bucket: S3_BUCKET_NAME,
  Key: '',
  ContentType: 'image/jpeg'
};

const s3 = {} as any;
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
s3.deleteParams = deleteParams;
s3.getParams = getParams;

module.exports = s3;
