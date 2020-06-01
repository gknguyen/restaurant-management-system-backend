import express, { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import errorHandler from '../../../commons/error.handler/errorHandler';
import { Payload, Results } from '../../../commons/constants/interfaces';
import { STATUS_CODE } from '../../../commons/constants/keyValues';
import { UserType } from './m_user_type.model';
import userTypeService from './m_user_type.service';

const userTypeRouter = Router();

userTypeRouter.get('/getList', getList_API());
userTypeRouter.post('/createOne', createOne_API());

/* ================================================================================== */
/*
get user type list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: '',
    values: [],
  } as Results;

  try {
    const userTypeList = (await userTypeService.getAll({
      attributes: ['id', 'typeName'],
    })) as UserType[];

    if (userTypeList && userTypeList.length > 0) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = 'get userTypeList successfully';
      results.values = userTypeList;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'userTypeList not found';
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = 'userType : /getList : ' + err.toString();
    return results;
  }
};

function getList_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = await getList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    },
  );
}

/* ================================================================================== */
/*
create 1 user type
*/
export const createOne = async (requestHeaders: any, requestBody: any) => {
  const results = {
    code: 0,
    message: '',
    values: {},
  } as Results;

  try {
    const token: any = requestHeaders.token;
    const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
    const loginUser: Payload | null = decodedToken ? decodedToken.payload : null;
    const createUserName: string | null = loginUser ? loginUser.username : null;

    const typeName: string | null = requestBody.typeName;

    if (!typeName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'typeName is missing';
      return results;
    }
    if (!createUserName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'createUserName is missing';
      return results;
    }

    const userType = (await userTypeService.postOne(
      {
        typeName: typeName,
        createUserName: createUserName,
      },
      null,
    )) as UserType;

    results.code = STATUS_CODE.SUCCESS;
    results.message = 'create 1 userType successfully';
    results.values = userType;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = 'userType : /createOne : ' + err.toString();
    return results;
  }
};

function createOne_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestHeaders: any = req.headers;
      const requestBody: any = req.body;
      const results = await createOne(requestHeaders, requestBody);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    },
  );
}

export default userTypeRouter;
