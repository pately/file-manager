import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  fileDirectory: process.env.FILE_DIR ?? './files',
  dataDirectory: process.env.DATA_DIR ?? './data',
};
