import express, { Router } from 'express';
import errorHandler from '../../../commons/error-handler';
import { Results, Payload } from '../../../commons/interfaces';
import { MenuType } from './m_menu_type.model';
import menuTypeService from './m_menu_type.service';
import { STATUS_CODE } from '../../../configs/config';
import jsonwebtoken from 'jsonwebtoken';

const menuTypeRouter = Router();

menuTypeRouter.get('/getList', getList_API());
menuTypeRouter.get('/getOne', getOne_API());
menuTypeRouter.post('/createOne', createOne_API());

/* ================================================================================== */
/*
get menu type list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: '',
    values: [],
  } as Results;

  try {
    const menuTypeList = (await menuTypeService.getAll({
      attributes: ['id', 'typeName'],
      order: [['createDateTime', 'ASC']],
    })) as MenuType[];

    if (menuTypeList && menuTypeList.length > 0) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = 'get menuTypeList successfully';
      results.values = menuTypeList;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'menuTypeList not found';
      results.values = menuTypeList;
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function getList_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
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
get menu type by menu type name
*/
export const getOne = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: '',
    values: {},
  } as Results;

  try {
    const typeName: string | null = requestQuery.typeName;

    if (!typeName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'some compulsory input data is missing';
      return results;
    }

    const menuType = (await menuTypeService.getOne({
      attributes: ['id', 'typeName'],
      where: { typeName: typeName },
    })) as MenuType;

    if (menuType) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = 'get menuType successfully';
      results.values = menuType;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'menuType not found';
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function getOne_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const requestQuery: any = req.query;
      const results = await getOne(requestQuery);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    },
  );
}

/* ================================================================================== */
/*
get menu type by menu type name
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

    if (!typeName || !createUserName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'some compulsory input data is missing';
      return results;
    }

    const menuType = (await menuTypeService.postOne(
      {
        typeName: typeName,
        createUserName: createUserName,
      },
      null,
    )) as MenuType;

    results.code = STATUS_CODE.SUCCESS;
    results.message = 'create menuType successfully';
    results.values = menuType;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function createOne_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
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

export default menuTypeRouter;
