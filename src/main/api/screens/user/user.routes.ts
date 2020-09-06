import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { Payload } from '../../../../commons/constants/interfaces';
import errorHandler from '../../../../commons/errorHandler';
import userController from './user.controllers';
import multer from 'multer';
import { uploadFileToS3 } from '../../general/amazon.S3/amazon.S3.routes';

const uploadMulter = multer();
const userScreenRouter = Router();

userScreenRouter.get('/getList', getUserList());
userScreenRouter.get('/getOne', getUser());
userScreenRouter.get('/searchList', searchUserList());
userScreenRouter.post(
  '/createOne',
  uploadMulter.array('files', 12),
  createUser(false),
  uploadFileToS3(),
);
userScreenRouter.put(
  '/editOne',
  uploadMulter.array('files', 12),
  editUser(false),
  getUser(false),
  uploadFileToS3(),
);
userScreenRouter.delete('/deleteList', deleteUserList());

/** ================================================================================== */
/**
function
*/

function getUserList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = await userController.getUserList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function getUser(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const userId = req.query.userId as string;

      const results = await userController.getUser(userId);

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

function searchUserList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const searchValue = req.query.searchValue as any;

      const results = await userController.searcUserList(searchValue);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

function createUser(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
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

function editUser(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as Payload;
      const editUserId = userInfo.id;

      const userId = req.query.userId as string;

      const userTypeName = req.body.userTypeName as string;
      const username = req.body.username as string;
      // const password = req.body.password as string;
      const fullName = req.body.fullName as string;
      const age = req.body.age as number;
      const phoneNumber = req.body.phoneNumber as string;
      const email = req.body.email as string;
      const avatar = req.body.avatar as string;

      const results = await userController.editUser(
        userId,
        userTypeName,
        username,
        // password,
        fullName,
        age,
        phoneNumber,
        email,
        avatar,
        editUserId,
      );

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          req.query.folderName = 'users';
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function deleteUserList() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const userIdList = req.query.userIdList as string[];

      const results = await userController.deleteUserList(userIdList);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) throw results.message;
    },
  );
}

export default userScreenRouter;
