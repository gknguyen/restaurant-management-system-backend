import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { Payload, Results } from '../../../commons/constants/interfaces';
import errorHandler from '../../../commons/errorHandler/errorHandler';
import userTypeModel, { UserType } from '../m.user.type/m_user_type.model';
import userTypeService from '../m.user.type/m_user_type.service';
import { User } from './s_user.model';
import userService from './s_user.service';

const Crypto = require('cryptojs').Crypto;

const userRouter = Router();

userRouter.get('/getList', getList_API());
userRouter.get('/getOne', getOne_API());
userRouter.post('/createOne', createOne_API());
userRouter.put('/editOne', editOne_API());

/** ================================================================================== */
/**
get user list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: '',
    values: null,
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
      results.code = STATUS_CODE.OK;
      results.message = 'get userList successfully';
      results.values = userList;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'userList not found';
      results.values = [];
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

/** ================================================================================== */
/**
get 1 user
*/
export const getOne = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: '',
    values: null,
  } as Results;

  try {
    const userId: string | null = requestQuery.userId;

    if (!userId) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'userId is missing';
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
        {
          model: userTypeModel,
          as: 'userType',
          attributes: ['id', 'typeName'],
        },
      ],
    })) as User;

    if (user) {
      results.code = STATUS_CODE.OK;
      results.message = 'get user successfully';
      results.values = user;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'user not found';
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

/** ================================================================================== */
/**
create 1 user
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

    const userTypeName: string | null = requestBody.userTypeName;
    const username: string | null = requestBody.username;
    const password: string | null = requestBody.password;
    const fullName: string | null = requestBody.fullName;
    const age: number | null = requestBody.age;
    const phoneNumber: string | null = requestBody.phoneNumber;
    const email: string | null = requestBody.email;
    const avatar: string | null = requestBody.avatar;

    if (!username) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'username is missing';
      return results;
    }
    if (!password) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'password is missing';
      return results;
    }
    if (!userTypeName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'userTypeName is missing';
      return results;
    }
    if (!fullName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'fullName is missing';
      return results;
    }
    if (!age) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'age is missing';
      return results;
    }
    if (!phoneNumber) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'phoneNumber is missing';
      return results;
    }
    if (!email) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'email is missing';
      return results;
    }
    // if (!avatar) {
    //   results.code = STATUS_CODE.NOT_FOUND;
    //   results.message = 'avatar is missing';
    //   return results;
    // }

    const userType = (await userTypeService.getOne({
      where: { typeName: userTypeName },
    })) as UserType;

    if (!userType) {
      results.code = STATUS_CODE.PRECONDITION_FAILED;
      results.message = 'invalid userTypeName';
      return results;
    }

    const encodedPass = Crypto.AES.encrypt(password, 'Secret Passphrase');

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
        createUserId: createUserId,
      },
      null,
    )) as User;

    results.code = STATUS_CODE.OK;
    results.message = 'create user successfully';
    results.values = user;
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

/** ================================================================================== */
/**
update 1 user
*/
export const editOne = async (requestHeaders: any, requestQuery: any, requestBody: any) => {
  const results = {
    code: 0,
    message: '',
    values: null,
  } as Results;

  try {
    const token: any = requestHeaders.token;
    const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
    const loginUser: Payload = decodedToken.payload;
    const editUserId: string = loginUser.id;

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

    if (!userId) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'userId is missing';
      return results;
    }

    const informations: any = {
      id: userId,
      editUserId: editUserId,
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

    results.code = STATUS_CODE.OK;
    results.message = 'update user successfully';
    results.values = successFlag === false ? 'updated' : 'inserted';
    return results;
  } catch (err) {
    results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function editOne_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestHeaders: any = req.headers;
      const requestQuery: any = req.query;
      const requestBody: any = req.body;
      const results = await editOne(requestHeaders, requestQuery, requestBody);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default userRouter;
