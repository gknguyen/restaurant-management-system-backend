import path from 'path';
import multer from 'multer';
import express from 'express';
import CONSTANTS from './constant';
import errorHandler from './errorHandler';
import STATUS_CODE from 'http-status';

export function checkFilesInMulter(multerRequestHandler: express.RequestHandler<any>) {
  const result = { ...CONSTANTS.RESULT, function: 'checkFilesInMulter()' };
  return errorHandler(
    result,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      multerRequestHandler(req, res, (err: any) => {
        if (err) {
          const error: multer.MulterError = err;
          res.status(STATUS_CODE.PRECONDITION_FAILED).send(`${error.code} : ${error.field}`);
        } else next();
      });
    },
  );
}

export default class Multer {
  constructor(folderName: string) {
    this.folderPath = `../../images/${folderName}`;
  }

  private folderPath: string;

  private storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, this.folderPath)),
    filename: (req, file, cb) => cb(null, file.originalname.toLowerCase().split(' ').join('-')),
  });

  public downloadFile = multer({
    storage: this.storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      )
        cb(null, true);
      else cb(null, false);
    },
  });
}
