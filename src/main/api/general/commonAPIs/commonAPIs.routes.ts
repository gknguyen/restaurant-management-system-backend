import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { Payload } from '../../../../commons/constants/interfaces';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import commonAPIsController from './commonAPIs.controllers';

const commonAPIsRouter = Router();

/** menu type */
commonAPIsRouter.get('/menuType/getList', getMenuTypeList());
commonAPIsRouter.get('/menuType/getOne', getMenuType());
commonAPIsRouter.post('/menuType/createOne', createMenuType());

/** product type */
commonAPIsRouter.get('/productType/getList', getProductTypeList());
commonAPIsRouter.get('/productType/getOne', getProductType());
commonAPIsRouter.post('/productType/createOne', createProductType());

/** user type */
commonAPIsRouter.get('/userType/getList', getUserTypeList());
commonAPIsRouter.post('/userType/createOne', createUserType());

/** ================================================================================== */
/**
functions
*/

/** menu type */
function getMenuTypeList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await commonAPIsController.getMenuTypeList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function getMenuType() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const typeName = req.query.typeName as string;

      const results = await commonAPIsController.getMenuType(typeName);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function createMenuType() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const typeName = req.body.typeName as string;

      const results = await commonAPIsController.createMenuType(typeName);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

/** product type */
function getProductTypeList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await commonAPIsController.getProductTypeList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function getProductType() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const typeName = req.query.typeName as string;

      const results = await commonAPIsController.getProductType(typeName);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function createProductType() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const typeName: string | null = req.body.typeName as string;

      const results = await commonAPIsController.createProductType(typeName);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

/** user type */
function getUserTypeList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await commonAPIsController.getUserTypeList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function createUserType() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const typeName = req.body.typeName as string;

      const results = await commonAPIsController.createUserType(typeName);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default commonAPIsRouter;
