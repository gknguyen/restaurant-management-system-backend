import express, { Router } from 'express';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import STATUS_CODE from 'http-status';
import mainController from './main.controllers';
import { Order } from '../../../database/mysql/s_order/s_order.model';
import { OrderDetail } from '../../../database/mysql/s_order_detail/s_order_detail.model';

const mainScreenRouter = Router();

/** get APIs */
mainScreenRouter.get('/getList', getProductList());

/** post APIs */
mainScreenRouter.post(
  '/createOne',
  createCustomer(false),
  createOrder(false),
  createOrderDetailList(false),
  reduceQuantityOfSelectedProducts(),
);

/** ================================================================================== */
/**
functions
*/

function getProductList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await mainController.getProductList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function createCustomer(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const fullName = req.body.customer.fullName as string;
      const phoneNumber = req.body.customer.phoneNumber as string;
      const email = req.body.customer.email as string;
      const address = req.body.customer.address as string;

      const results = await mainController.createCustomer(
        fullName,
        phoneNumber,
        email,
        address,
      );

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          req.body.customerId = results.values.id;
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function createOrder(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const finalPrice = req.body.finalPrice as number;
      const customerId = req.body.customerId as string;

      const results = await mainController.createOrder(customerId, finalPrice);

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          req.body.orderId = results.values.id;
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function createOrderDetailList(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const orderDetails = req.body.orderDetails as OrderDetail[];
      const orderId = req.body.orderId as string;

      const results = await mainController.createOrderDetailList(
        orderId,
        orderDetails,
      );

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function reduceQuantityOfSelectedProducts(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const orderDetails = req.body.orderDetails as OrderDetail[];

      const results = await mainController.reduceQuantityOfSelectedProducts(
        orderDetails,
      );

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

export default mainScreenRouter;
