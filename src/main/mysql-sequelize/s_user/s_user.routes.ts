import express, { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import errorHandler from '../../../commons/error-handler';
import { Payload, Results } from '../../../commons/interfaces';
import { STATUS_CODE } from '../../../configs/config';
import userTypeModel, { UserType } from '../m_user_type/m_user_type.model';
import userTypeService from '../m_user_type/m_user_type.service';
import { User } from './s_user.model';
import userService from './s_user.service';

const Crypto = require('cryptojs').Crypto;

const userRouter = Router();

userRouter.get('/getList', getList_API());
userRouter.get('/getOne', getOne_API());
userRouter.post('/createOne', createOne_API());
userRouter.put('/updateOne', updateOne_API());

/* ================================================================================== */
/*
get user list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: '',
    values: [],
  } as Results;

  try {
    const userList = (await userService.getAll({
      attributes: [
        'id',
        'username',
        'fullName',
        'phoneNumber',
        'email',
        'activeStatus',
        'loginDatetime',
      ],
      include: [
        {
          model: userTypeModel,
          as: 'userType',
          attributes: ['typeName'],
        },
      ],
    })) as User[];

    if (userList && userList.length > 0) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = 'get userList successfully';
      results.values = userList;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'userList not found';
      results.values = userList;
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
get 1 user
*/
export const getOne = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: '',
    values: [],
  } as Results;

  try {
    const userId: string | null = requestQuery.userId;

    if (!userId) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'some compulsory input data is missing';
      return results;
    }

    const user = (await userService.getOne({
      attributes: [
        'id',
        'username',
        'fullName',
        'age',
        'phoneNumber',
        'email',
        'avatar',
        'loginDateTime',
        'activeStatus',
      ],
      where: { id: userId },
      include: [
        { model: userTypeModel, as: 'userType', attributes: ['id', 'typeName'] },
      ],
    })) as User;

    if (user) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = 'get user successfully';
      results.values = user;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'user not found';
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
create 1 user
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

    const username: string | null = requestBody.username;
    const password: string | null = requestBody.password;
    const userTypeName: string | null = requestBody.userTypeName;
    const fullName: string | null = requestBody.fullName;
    const age: number | null = requestBody.age;
    const phoneNumber: string | null = requestBody.phoneNumber;
    const email: string | null = requestBody.email;
    const avatar: string | null = requestBody.avatar;

    if (
      !username ||
      !password ||
      !userTypeName ||
      !fullName ||
      !age ||
      !phoneNumber ||
      !email ||
      !avatar ||
      !createUserName
    ) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'some compulsory input data is missing';
      return results;
    }

    const userType = (await userTypeService.getOne({
      where: { typeName: userTypeName },
    })) as UserType;

    if (userType) {
      let encodedPass = Crypto.AES.encrypt(password, 'Secret Passphrase');

      const user = (await userService.postOne(
        {
          userTypeId: userType.id,
          username: username,
          password: encodedPass,
          fullName: fullName,
          age: age,
          phoneNumber: phoneNumber,
          email: email,
          avatar: avatar,
          createUserName: createUserName,
        },
        null,
      )) as User;

      results.code = STATUS_CODE.SUCCESS;
      results.message = 'create user successfully';
      results.values = user;
      return results;
    } else {
      results.code = STATUS_CODE.INVALID;
      results.message = 'invalid userTypeName';
      return results;
    }
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

/* ================================================================================== */
/*
update 1 user
*/
export const updateOne = async (
  requestHeaders: any,
  requestQuery: any,
  requestBody: any,
) => {
  const results = {
    code: 0,
    message: '',
    values: {},
  } as Results;

  try {
    const token: any = requestHeaders.token;
    const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
    const loginUser: Payload | null = decodedToken ? decodedToken.payload : null;
    const updateUserName: string | null = loginUser ? loginUser.username : null;

    const userId: string | null = requestQuery.userId;

    const username: string | null = requestBody.username;
    const password: string | null = requestBody.password;
    const userTypeId: string | null = requestBody.user_type_name;
    const fullName: string | null = requestBody.full_name;
    const age: number | null = requestBody.age;
    const phoneNumber: string | null = requestBody.phone_number;
    const email: string | null = requestBody.email;
    const avatar: string | null = requestBody.avatar;
    const loginDatetime: Date | null = requestBody.loginDatetime;
    const authToken: string | null = requestBody.authToken;

    if (!userId || !updateUserName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'some compulsory input data is missing';
      return results;
    }

    const informations: any = {
      id: userId,
      updateUserName: updateUserName,
    };
    if (username) {
      informations['username'] = username;
    }
    if (password) {
      let encodedPass = Crypto.AES.encrypt(password, 'Secret Passphrase');
      informations['password'] = encodedPass;
    }
    if (userTypeId) {
      informations['userTypeId'] = userTypeId;
    }
    if (fullName) {
      informations['fullName'] = fullName;
    }
    if (age) {
      informations['age'] = age;
    }
    if (phoneNumber) {
      informations['phoneNumber'] = phoneNumber;
    }
    if (email) {
      informations['email'] = email;
    }
    if (avatar) {
      informations['avatar'] = avatar;
    }
    if (loginDatetime) {
      informations['loginDateTime'] = loginDatetime;
    }
    if (authToken) {
      informations['authToken'] = authToken;
    }

    const successFlag = (await userService.putOne(informations, null)) as boolean;

    results.code = STATUS_CODE.SUCCESS;
    results.message = 'update user successfully';
    results.values = successFlag === false ? 'updated' : 'inserted';
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function updateOne_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const requestHeaders: any = req.headers;
      const requestQuery: any = req.query;
      const requestBody: any = req.body;
      const results = await updateOne(requestHeaders, requestQuery, requestBody);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    },
  );
}

export default userRouter;
