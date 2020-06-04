import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { Payload, Results } from '../../../commons/constants/interfaces';
import errorHandler from '../../../commons/errorHandler';
import { verifyToken } from '../../verifyToken/verifyToken.routes';
import { MenuType } from './m_menu_type.model';
import menuTypeService from './m_menu_type.service';

const menuTypeRouter = Router();

menuTypeRouter.get('/getList', verifyToken(), getList_API());
menuTypeRouter.get('/getOne', verifyToken(), getOne_API());
menuTypeRouter.post('/createOne', verifyToken(), createOne_API());

/* ================================================================================== */
/*
get menu type list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: '',
    values: null,
  } as Results;

  try {
    const menuTypeList = (await menuTypeService.getAll({
      attributes: ['id', 'typeName'],
      order: [['createDateTime', 'ASC']],
    })) as MenuType[];

    if (menuTypeList && menuTypeList.length > 0) {
      results.code = STATUS_CODE.OK;
      results.message = 'get menuTypeList successfully';
      results.values = menuTypeList;
      return results;
    } else {
      results.code = STATUS_CODE.OK;
      results.message = 'menuTypeList not found';
      results.values = menuTypeList;
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function getList_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = await getList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
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
    values: null,
  } as Results;

  try {
    const typeName: string | null = requestQuery.typeName;

    if (!typeName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'typeName is missing';
      return results;
    }

    const menuType = (await menuTypeService.getOne({
      attributes: ['id', 'typeName'],
      where: { typeName: typeName },
    })) as MenuType;

    if (menuType) {
      results.code = STATUS_CODE.OK;
      results.message = 'get menuType successfully';
      results.values = menuType;
      return results;
    } else {
      results.code = STATUS_CODE.OK;
      results.message = 'menuType not found';
      results.values = {};
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function getOne_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestQuery: any = req.query;
      const results = await getOne(requestQuery);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
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
    values: null,
  } as Results;

  try {
    const token: any = requestHeaders.token;
    const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
    const loginUser: Payload = decodedToken.payload;
    const createUserId: string = loginUser.id;

    const typeName: string | null = requestBody.typeName;

    if (!typeName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'typeName is missing';
      return results;
    }

    const menuType = (await menuTypeService.postOne(
      {
        typeName: typeName,
        createUserId: createUserId,
      },
      null,
    )) as MenuType;

    results.code = STATUS_CODE.OK;
    results.message = 'create menuType successfully';
    results.values = menuType;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
    results.message = err.toString();
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
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default menuTypeRouter;
