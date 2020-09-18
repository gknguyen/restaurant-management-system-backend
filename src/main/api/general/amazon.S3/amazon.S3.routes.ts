import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import multer from 'multer';
import errorHandler from '../../../../commons/errorHandler';
import amazonS3nController from './amazon.S3.controllers';

const uploadMulter = multer();
const awsS3Router = Router();

/** get APIs */
awsS3Router.get('/getSignedUrl', getSignedUrl());
awsS3Router.get('/headObject', headObject());

/** post APIs */
awsS3Router.post(
  '/uploadFileToS3',
  uploadMulter.array('files', 12),
  uploadFileToS3(),
);

/** ================================================================================== */
/**
functions
*/

function getSignedUrl() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const fileName = req.query.fileName as string;
      const fileType = req.query.fileType as string;
      const folderName = req.query.folderName as string;

      const results = await amazonS3nController.getSignedUrl(
        fileName,
        fileType,
        folderName,
      );

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function headObject() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
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

export function uploadFileToS3() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const files = req.files as Express.Multer.File[];
      const folderName = req.query.folderName as string;

      const results = await amazonS3nController.uploadFileToS3(files, folderName);

      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

export default awsS3Router;
