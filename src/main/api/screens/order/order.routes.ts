import express, { Router } from 'express';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import STATUS_CODE from 'http-status';
import orderController from './order.controllers';

const orderScreenRouter = Router();

/** get APIs */
orderScreenRouter.get('/getList', getOrderList());
orderScreenRouter.get('/getOne', getOrder());

/** ================================================================================== */
/**
functions
*/

function getOrderList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await orderController.getOrderList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function getOrder() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const orderId = req.query.orderId as string;

      const results = await orderController.getOrder(orderId);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

export default orderScreenRouter;
