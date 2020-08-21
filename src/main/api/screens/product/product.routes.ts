import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../../commons/errorHandler';
import productController from './product.controllers';
import jsonwebtoken from 'jsonwebtoken';
import { Payload } from '../../../../commons/constants/interfaces';
import multer from 'multer';
import { uploadFileToS3_API } from '../../general/amazon.S3/amazon.S3.routes';

const uploadMulter = multer();
const productScreenRouter = Router();

productScreenRouter.get('/getList', getProductList());
productScreenRouter.get('/getOne', getProduct());
productScreenRouter.get('/searchList', searchProductList());
productScreenRouter.post(
  '/createOne',
  uploadMulter.array('files', 12),
  createProduct(false),
  uploadFileToS3_API(),
);
productScreenRouter.put('/editOne', editProduct());
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

function getProduct() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const productId = req.query.productId as string;

      const results = await productController.getProduct(productId);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
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
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as Payload;
      const createUserId = userInfo.id;

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
        createUserId,
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

function editProduct() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as Payload;
      const editUserId = userInfo.id;

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
        editUserId,
      );

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
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
