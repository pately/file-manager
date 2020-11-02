import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = new Date().getTime();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const fileFilter = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  if (fileExtName !== '.txt') {
    req.fileValidationError = 'Only .txt files are allowed';
    callback(null, false);
  }
  callback(null, true);
};
