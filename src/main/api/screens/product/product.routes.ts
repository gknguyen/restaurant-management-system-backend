import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import productController from './product.controllers';
import jsonwebtoken from 'jsonwebtoken';
import { Payload } from '../../../../commons/constants/interfaces';
import multer from 'multer';
import { uploadFileToS3 } from '../../general/amazon.S3/amazon.S3.routes';

const uploadMulter = multer();
const productScreenRouter = Router();

/** get APIs */
productScreenRouter.get('/getList', getProductList());
productScreenRouter.get('/getOne', getProduct());
productScreenRouter.get('/searchList', searchProductList());

/** post APIs */
productScreenRouter.post(
  '/createOne',
  uploadMulter.array('files', 12),
  createProduct(false),
  uploadFileToS3(),
);

/** put APIs */
productScreenRouter.put(
  '/editOne',
  uploadMulter.array('files', 12),
  editProduct(false),
  getProduct(false),
  uploadFileToS3(),
);

/** delete APIs */
productScreenRouter.delete('/deleteList', deleteProductList());

/** ================================================================================== */
/**
function
*/

function getProductList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await productController.getProductList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function getProduct(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const productId = req.query.productId as string;

      const results = await productController.getProduct(productId);

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          res.status(results.code).send(results);
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function searchProductList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const searchValue = req.query.searchValue as any;

      const results = await productController.searchProductList(searchValue);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function createProduct(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const productTypeName = req.body.productTypeName as string;
      const menuTypeName = req.body.menuTypeName as string;
      const name = req.body.name as string;
      const price = req.body.price as number;
      const unit = req.body.unit as string;
      const amount = req.body.amount as number;
      const description = req.body.description as string;
      const image = req.body.image as string;

      const results = await productController.createProduct(
        productTypeName,
        menuTypeName,
        name,
        price,
        unit,
        amount,
        description,
        image,
      );

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          res.status(results.code).send(results);
          req.query.folderName = 'products';
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function editProduct(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const productId = req.query.productId as string;

      const productTypeName = req.body.productTypeName as string;
      const menuTypeName = req.body.menuTypeName as string;
      const name = req.body.name as string;
      const price = req.body.price as number;
      const unit = req.body.unit as string;
      const amount = req.body.amount as number;
      const description = req.body.description as string;
      const image = req.body.image as string;

      const results = await productController.editProduct(
        productId,
        productTypeName,
        menuTypeName,
        name,
        price,
        unit,
        amount,
        description,
        image,
      );

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          req.query.folderName = 'products';
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function deleteProductList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const productIdList = req.query.productIdList as string[];

      const results = await productController.deleteProductList(productIdList);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

export default productScreenRouter;
