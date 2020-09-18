import express, { Router } from 'express';
import errorHandler from '../../../../commons/errorHandler';
import STATUS_CODE from 'http-status';
import mainController from './main.controllers';

const mainScreenRouter = Router();

/** get APIs */
mainScreenRouter.get('/getList', getProductList());

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
      const results = await mainController.getProductList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

export default mainScreenRouter;
