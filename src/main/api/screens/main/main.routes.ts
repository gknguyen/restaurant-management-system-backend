import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import { OrderDetail } from '../../../database/mysql/s_order_detail/s_order_detail.model';
import mainController from './main.controllers';

const mainScreenRouter = Router();

/** get APIs */
mainScreenRouter.get('/getProductList', getProductList());
mainScreenRouter.get('/searchCustomer', searchCustomer());
mainScreenRouter.get('/getUnpaidOrderList', getUnpaidOrderList());

/** post APIs */
mainScreenRouter.post(
  '/createOrder',
  createOrEditCustomer(false),
  createOrEditOrder(false),
  createOrEditOrderDetailList(false),
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

function searchCustomer() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const searchValue = req.query.searchValue as string;

      const results = await mainController.searchCustomer(searchValue);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function getUnpaidOrderList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await mainController.getUnpaidOrderList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function createOrEditCustomer(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const customerId = req.body.customer.id as string;
      const fullName = req.body.customer.fullName as string;
      const phoneNumber = req.body.customer.phoneNumber as string;
      const email = req.body.customer.email as string;
      const address = req.body.customer.address as string;

      const results = await mainController.createOrEditCustomer(
        customerId,
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

function createOrEditOrder(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const orderId = req.body.id as string;
      const no = req.body.no as number;
      const finalPrice = req.body.finalPrice as number;
      const activeStatus = req.body.activeStatus as boolean;
      const customerId = req.body.customerId as string;

      const results = await mainController.createOrEditOrder(
        orderId,
        customerId,
        no,
        finalPrice,
        activeStatus,
      );

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

function createOrEditOrderDetailList(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const orderDetails = req.body.orderDetails as OrderDetail[];
      const orderId = req.body.orderId as string;

      const results = await mainController.createOrEditOrderDetailList(
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
      const orderId = req.body.orderId as string;

      const results = await mainController.reduceQuantityOfSelectedProducts(
        orderDetails,
      );

      if (endHere) {
        results.values = orderId;
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
