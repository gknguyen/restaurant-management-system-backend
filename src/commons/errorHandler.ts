import express from 'express';
import fs from 'fs';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import os from 'os';
import path from 'path';
import CONSTANTS from './constant';
import { HTTPdata, Payload } from './interfaces';
import util from './utils';

const errorLogFilePath = path.join(
  __dirname,
  `../../${CONSTANTS.LOG.FOLDER_NAME}/${CONSTANTS.LOG.ERROR.FOLDER_NAME}/${CONSTANTS.LOG.ERROR.FILE_NAME}.${CONSTANTS.LOG.ERROR.FILE_FORMAT}`,
);

const errorHandler =
  (
    result: HTTPdata,
    fn: (req: express.Request, res: express.Response, next: express.NextFunction) => void,
  ) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(async (error: Error) => {
        /** get data from headers */
        const token = req.headers.token as string;
        const userInfo = jsonwebtoken.decode(token) as Payload;

        let errorMessage = error.toString();
        errorMessage = errorMessage.replace('SequelizeValidationError: notNull Violation: ', '');
        errorMessage = errorMessage.replace('SequelizeUniqueConstraintError: Validation error', '');
        console.error(`errorHandler: ${errorMessage}`);
        console.error(`jaMoment: ${util.formatDate(new Date())} at function ${result.function}`);

        /** add error to file errorLog.txt */
        fs.appendFile(
          errorLogFilePath,
          `========================================================` +
            `date: ${JSON.stringify(util.formatDate(new Date()))}` +
            os.EOL +
            `API: ${JSON.stringify(req.baseUrl + req.path)}` +
            os.EOL +
            `error: ${JSON.stringify(errorMessage)}` +
            os.EOL +
            `username: ${JSON.stringify(userInfo?.username)}` +
            os.EOL,
          (err) => err && console.error(err),
        );

        /** if error, rollback the transaction */
        if (result.transaction) await result.transaction.rollback();

        /** send response to client-side (FE) */
        res.status(result.code || STATUS_CODE.INTERNAL_SERVER_ERROR).send(errorMessage);
      });

export default errorHandler;
