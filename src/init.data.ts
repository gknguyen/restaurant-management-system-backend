import fs from 'fs';
import path from 'path';
import CONSTANTS from './commons/constant';
import { ProductTypeName, UserTypeName } from './commons/enum';
import DB from './database/database.service';

export const initFolders = () => {
  const logFolderPath = path.join(__dirname, `../${CONSTANTS.LOG.FOLDER_NAME}`);
  const accessLogFolderPath = path.join(
    __dirname,
    `../${CONSTANTS.LOG.FOLDER_NAME}/${CONSTANTS.LOG.ACCESS.FOLDER_NAME}`,
  );
  const errorLogFolderPath = path.join(
    __dirname,
    `../${CONSTANTS.LOG.FOLDER_NAME}/${CONSTANTS.LOG.ERROR.FOLDER_NAME}`,
  );

  if (!fs.existsSync(logFolderPath)) fs.mkdirSync(logFolderPath);
  if (!fs.existsSync(accessLogFolderPath)) fs.mkdirSync(accessLogFolderPath);
  if (!fs.existsSync(errorLogFolderPath)) fs.mkdirSync(errorLogFolderPath);
};

export const initData = () => {
  Object.values(UserTypeName).forEach((name) =>
    DB.userType.findOrCreate({
      where: { name: name },
      defaults: { name: name },
    }),
  );

  Object.values(ProductTypeName).forEach((name) =>
    DB.productType.findOrCreate({
      where: { name: name },
      defaults: { name: name },
    }),
  );
};
