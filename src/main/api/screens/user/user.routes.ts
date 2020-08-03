import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { Payload } from '../../../../commons/constants/interfaces';
import errorHandler from '../../../../commons/errorHandler/errorHandler';
import userController from './user.controllers';

const userScreenRouter = Router();

userScreenRouter.get('/getList', getUserList());
userScreenRouter.get('/getOne', getUser());
userScreenRouter.post('/createOne', createUser());
userScreenRouter.put('/editOne', editUser());

/** ================================================================================== */
/**
function
*/

function getUserList() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = await userController.getUserList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function getUser() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const userId = req.query.userId as string;

      const results = await userController.getUser(userId);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function createUser() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as Payload;
      const createUserId = userInfo.id;

      const userTypeName = req.body.userTypeName as string;
      const username = req.body.username as string;
      const password = req.body.password as string;
      const fullName = req.body.fullName as string;
      const age = req.body.age as number;
      const phoneNumber = req.body.phoneNumber as string;
      const email = req.body.email as string;
      const avatar = req.body.avatar as string;

      const results = await userController.createUser(
        userTypeName,
        username,
        password,
        fullName,
        age,
        phoneNumber,
        email,
        avatar,
        createUserId,
      );

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

function editUser() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as Payload;
      const editUserId = userInfo.id;

      const userId: string | null = req.query.userId as string;

      const userTypeId = req.body.userTypeId as string;
      const username = req.body.username as string;
      const password = req.body.password as string;
      const fullName = req.body.fullName as string;
      const age = req.body.age as number;
      const phoneNumber = req.body.phoneNumber as string;
      const email = req.body.email as string;
      const avatar = req.body.avatar as string;

      const results = await userController.editUser(
        userId,
        userTypeId,
        username,
        password,
        fullName,
        age,
        phoneNumber,
        email,
        avatar,
        editUserId,
      );

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default userScreenRouter;
