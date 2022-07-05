export {};
const path = require('path');
const multer = require('multer');
const { UPLOAD_LIMIT } = require('./vars');

const fileFilter = (req: Request, file: any, cb: any) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log(file.originalname);

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb({ message: 'Invalid file type' });
};

const storage = multer.memoryStorage();

const uploadMulter = multer({ storage, fileFilter, limits: { fieldSize: `${UPLOAD_LIMIT}MB` } });

module.exports = {
  upload: uploadMulter
};
