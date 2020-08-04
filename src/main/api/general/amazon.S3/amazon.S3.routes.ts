import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import multer from 'multer';
import errorHandler from '../../../../commons/errorHandler';
import amazonS3nController from './amazon.S3.controllers';

const uploadMulter = multer();
const awsS3Router = Router();

awsS3Router.get('/getSignedUrl', getSignedUrl_API());
awsS3Router.get('/headObject', headObject_API());
awsS3Router.post('/uploadFileToS3', uploadMulter.array('files', 12), uploadFileToS3_API());

/** ================================================================================== */
/**
get signed URL
*/
function getSignedUrl_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const fileName = req.query.fileName as string;
      const fileType = req.query.fileType as string;
      const folderName = req.query.folderName as string;

      const results = await amazonS3nController.getSignedUrl(fileName, fileType, folderName);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

/** ================================================================================== */
/**
get file metadata
*/
function headObject_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const key = req.query.key as string;
      const versionId = req.query.versionId as string;

      const results = await amazonS3nController.headObject(key, versionId);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

/** ================================================================================== */
/**
upload files to S3
*/
function uploadFileToS3_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const files = req.files as Express.Multer.File[];
      const results = await amazonS3nController.uploadFileToS3(files);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default awsS3Router;
