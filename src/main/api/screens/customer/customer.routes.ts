import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import customerController from './customer.controllers';

const customerScreenRouter = Router();

/** get APIs */
customerScreenRouter.get('/getList', getCustomerList());

/** ================================================================================== */
/**
functions
*/

function getCustomerList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await customerController.getCustomerList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

export default customerScreenRouter;
