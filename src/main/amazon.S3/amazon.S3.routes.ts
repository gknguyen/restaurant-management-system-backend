import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import multer from 'multer';
import errorHandler from '../../commons/errorHandler/errorHandler';
import { getSignedUrl, headObject, uploadFileToS3 } from './amazon.S3.service';

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
      const requestQuery: any = req.query;
      const results = await getSignedUrl(requestQuery);

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
      const key: string | null | undefined = req.query.key;
      const versionId: string | null | undefined = req.query.versionId;

      const results = await headObject(key, versionId);

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
      const files = req.files;
      const results = await uploadFileToS3(files);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default awsS3Router;
