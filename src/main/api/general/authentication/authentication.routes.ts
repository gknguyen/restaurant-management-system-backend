import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../../commons/errorHandler';
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
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const loginUsername = req.body.username as string;
      const loginPassword = req.body.password as string;

      const results = await authenticationController.login(
        loginUsername,
        loginPassword,
      );

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export function verifyToken() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const token = req.headers.token as string;

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
