import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../../commons/errorHandler/errorHandler';
import authenticationController from './authentication.controllers';

const authRouter = Router();

authRouter.post('/login', login());
authRouter.post('/getVerify', verifyToken());

/** ================================================================================== */
/**
functions
*/

function login() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestBody: any = req.body;
      const results = await authenticationController.login(requestBody);

      console.log(results);
      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export function verifyToken() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token: any = req.headers.token;
      const results = await authenticationController.getVerify(token);

      if (results.code !== STATUS_CODE.OK) {
        res.status(results.code).send(results);
        throw results.message;
      } else {
        next();
      }
    },
  );
}

export default authRouter;
