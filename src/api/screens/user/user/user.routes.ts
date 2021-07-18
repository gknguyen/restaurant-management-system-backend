import Crypto from 'crypto-js';
import express from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import sequelize from 'sequelize';
import CONSTANTS from '../../../../config/constant';
import ENV from '../../../../config/env';
import errorHandler from '../../../../config/errorHandler';
import Multer from '../../../../config/multer';
import DB from '../../../../database/database.service';
import { checkFilesInMulter } from '../../../common/file/image.routes';

const userMulter = new Multer(CONSTANTS.IMAGE.AVATAR_FOLDER_NAME);
const userScreenRouter = express.Router();

/** get APIs */
userScreenRouter.get('/', getUserList());
userScreenRouter.get('/:id', getUser());

/** post APIs */
userScreenRouter.post('/search', searchUserList());
userScreenRouter.post(
  '/',
  checkFilesInMulter(userMulter.downloadFile.single('file')),
  createUser(),
);

/** put APIs */
userScreenRouter.patch('/:id', userMulter.downloadFile.single('file'), editUser(), getUser());

/** delete APIs */
userScreenRouter.delete('/:id', deleteUser());

/** ================================================================================== */
/**
function
*/

function getUserList() {
  const result = { ...CONSTANTS.RESULT, function: 'getUserList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const userList = await DB.user.findAll({
      attributes: ['id', 'username', 'fullName', 'phone', 'email', 'isActive', 'loginDateTime'],
      include: [
        {
          model: DB.userType,
          as: 'userType',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (userList?.length > 0)
      res.status(STATUS_CODE.OK).send(userList.map((user) => user.get({ plain: true })));
    else res.status(STATUS_CODE.NO_CONTENT).send([]);
  });
}

function getUser() {
  const result = { ...CONSTANTS.RESULT, function: 'getUser()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const userId = req.params.id;

    if (!userId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    const user = await DB.user.findOne({
      attributes: [
        'id',
        'username',
        'fullName',
        'age',
        'phone',
        'email',
        'avatar',
        'loginDateTime',
        'isActive',
      ],
      where: { id: userId },
      include: [
        {
          model: DB.userType,
          as: 'userType',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (user) res.status(STATUS_CODE.OK).send(user.get({ plain: true }));
    else res.status(STATUS_CODE.NO_CONTENT).send(null);
  });
}

function searchUserList() {
  const result = { ...CONSTANTS.RESULT, function: 'searchUserList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const searchValue = req.body.searchValue;

    const userList = await DB.user.findAll({
      attributes: ['id', 'username', 'fullName', 'phone', 'email', 'isActive', 'loginDateTime'],
      where: {
        [sequelize.Op.or]: [
          { username: { [sequelize.Op.startsWith]: searchValue } },
          { fullName: { [sequelize.Op.startsWith]: searchValue } },
          { phoneNumber: { [sequelize.Op.startsWith]: searchValue } },
          { email: { [sequelize.Op.startsWith]: searchValue } },
          { loginDatetime: { [sequelize.Op.startsWith]: searchValue.split('/').join('-') } },
        ],
      },
      include: [
        {
          model: DB.userType,
          as: 'userType',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (userList?.length > 0)
      res.status(STATUS_CODE.OK).send(userList.map((user) => user.get({ plain: true })));
    else {
      const userList = await DB.user.findAll({
        attributes: ['id', 'username', 'fullName', 'phone', 'email', 'isActive', 'loginDateTime'],
        include: [
          {
            model: DB.userType,
            as: 'userType',
            attributes: ['id', 'name'],
            where: { name: { [sequelize.Op.startsWith]: searchValue } },
          },
        ],
      });

      if (userList?.length > 0)
        res.status(STATUS_CODE.OK).send(userList.map((user) => user.get({ plain: true })));
      else res.status(STATUS_CODE.NO_CONTENT).send([]);
    }
  });
}

function createUser() {
  const result = { ...CONSTANTS.RESULT, function: 'createUser()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const token = req.headers.token as string;
    const userInfo = jsonwebtoken.decode(token);
    const loginUserId = (userInfo as jsonwebtoken.JwtPayload)?.id;

    const file = req.file;

    const userTypeName = req.body.userTypeName;
    const username = req.body.username;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const age = req.body.age;
    const phone = req.body.phone;
    const email = req.body.email;

    if (
      !username ||
      !password ||
      !userTypeName ||
      !fullName ||
      !age ||
      !phone ||
      !email ||
      !file ||
      !loginUserId
    ) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    /** check if user is existed */
    const user = await DB.user.findOne({
      attributes: ['id'],
      where: { username: username },
    });

    if (user) {
      result.code = STATUS_CODE.CONFLICT;
      throw CONSTANTS.MESSAGES.HTTP.RESOURCE_EXISTED;
    }

    /** get user type id */
    const userType = await DB.userType.findOne({
      attributes: ['id'],
      where: { name: userTypeName },
    });

    if (!userType) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.INVALID.PARAMS;
    }

    const newUser = await DB.user.create({
      userTypeId: userType.id,
      username: username,
      password: Crypto.AES.encrypt('password', ENV.CRYPTO_SECRET).toString(),
      fullName: fullName,
      age: age,
      phone: phone,
      email: email,
      avatar: file.originalname,
      createUserId: loginUserId,
    });

    res.status(STATUS_CODE.OK).send(newUser.get({ plain: true }));
  });
}

function editUser() {
  const result = { ...CONSTANTS.RESULT, function: 'editUser()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token);
      const loginUserId = (userInfo as jsonwebtoken.JwtPayload)?.id;

      const file = req.file;

      const userId = req.params.id;

      const userTypeName = req.body.userTypeName;
      const username = req.body.username;
      const fullName = req.body.fullName;
      const age = req.body.age;
      const phone = req.body.phone;
      const email = req.body.email;

      if (!userId || !userTypeName || !loginUserId) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
      }

      /** get user type id */
      const userType = await DB.userType.findOne({
        attributes: ['id'],
        where: { name: userTypeName },
      });

      if (!userType) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw CONSTANTS.MESSAGES.HTTP.INVALID.PARAMS;
      }

      await DB.user.update(
        {
          userTypeId: userType.id,
          username: username || null,
          fullName: fullName || null,
          age: age || null,
          phoneNumber: phone || null,
          email: email || null,
          avatar: file?.originalname || null,
          editUserId: loginUserId,
        },
        {
          where: { id: userId },
        },
      );

      next();
    },
  );
}

function deleteUser() {
  const result = { ...CONSTANTS.RESULT, function: 'deleteUser()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const userId = req.params.id;

    if (!userId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    await DB.user.destroy({
      where: { id: userId },
    });

    res.status(STATUS_CODE.OK).send(null);
  });
}

export default userScreenRouter;
