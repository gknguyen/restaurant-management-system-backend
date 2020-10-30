import STATUS_CODE from 'http-status';
import moment, { utc } from 'moment-timezone';
import { Op } from 'sequelize';
import { CRYPTO_SECRET } from '../../../../commons/constants/env';
import { Results } from '../../../../commons/constants/interfaces';
import userTypeModel, {
  UserType,
} from '../../../database/mysql/m.user.type/m_user_type.model';
import mysqlService from '../../../database/mysql/mysqlServices';
import { User } from '../../../database/mysql/s.user/s_user.model';

const Crypto = require('cryptojs').Crypto;

class UserController {
  /** ================================================================================== */
  /**
  get user list
  */
  getUserList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const userList = (await mysqlService.userService.getAll({
        attributes: ['id', 'username', 'activeStatus', 'loginDateTime'],
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
        results.message = 'successfully';
        results.values = userList;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
        results.values = [];
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  get 1 user
  */
  getUser = async (userId: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!userId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const user = (await mysqlService.userService.getOne({
        attributes: ['id', 'username', 'loginDateTime', 'activeStatus'],
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
        results.message = 'successfully';
        results.values = user;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
        results.values = {};
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  search user list
  */
  searcUserList = async (searchValue: any | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const userList = (await mysqlService.userService.getAll({
        attributes: ['id', 'username', 'activeStatus', 'loginDateTime'],
        where: {
          [Op.or]: [
            { username: { [Op.startsWith]: searchValue } },
            { loginDatetime: { [Op.startsWith]: searchValue.split('/').join('-') } },
          ],
        },
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
        results.message = 'successfully';
        results.values = userList;
        return results;
      } else {
        const userList = (await mysqlService.userService.getAll({
          attributes: ['id', 'username', 'activeStatus', 'loginDateTime'],
          include: [
            {
              model: userTypeModel,
              as: 'userType',
              attributes: ['typeName'],
              where: { typeName: { [Op.startsWith]: searchValue } },
            },
          ],
        })) as User[];

        if (userList && userList.length > 0) {
          results.code = STATUS_CODE.OK;
          results.message = 'successfully';
          results.values = userList;
          return results;
        } else {
          results.code = STATUS_CODE.OK;
          results.message = 'no result';
          results.values = [];
          return results;
        }
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  create 1 user
  */
  createUser = async (
    userTypeName: string | null | undefined,
    username: string | null | undefined,
    password: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!username || !password || !userTypeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const userType = (await mysqlService.userTypeService.getOne({
        where: { typeName: userTypeName },
      })) as UserType;

      if (!userType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid userTypeName';
        return results;
      }

      const encodedPass = Crypto.AES.encrypt(password, CRYPTO_SECRET);

      const user = (await mysqlService.userService.postOne(
        {
          userTypeId: userType.id,
          username: username,
          password: encodedPass,
        },
        null,
      )) as User;

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = user;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  update 1 user
  */
  editUser = async (
    userId: string | null | undefined,
    username: string | null | undefined,
    activeStatus: string | null | undefined,
    loginDateTime: Date | null | undefined,
    userTypeName: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!userId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      /** find userTypeId bt userTypeName */
      if (userTypeName) {
        const userType = (await mysqlService.userTypeService.getOne({
          attributes: ['id', 'typeName'],
          where: { typeName: userTypeName },
        })) as UserType;

        if (!userType) {
          results.code = STATUS_CODE.PRECONDITION_FAILED;
          results.message = 'invalid userTypeName';
          return results;
        }

        userTypeName = userType.id;
      }

      await mysqlService.userService.putOne(
        {
          id: userId,
          userTypeId: userTypeName || undefined,
          username: username || undefined,
          activeStatus: activeStatus === 'active' ? true : false,
          loginDateTime: loginDateTime || undefined,
        },
        null,
      );

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = moment(utc()).format('YYYY-MM-DD hh:mm:ss');
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  delete 1 user
  */
  deleteUser = async (userId: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!userId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      await mysqlService.userService.delete({
        where: { id: userId },
      });

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = moment(utc()).format('YYYY-MM-DD hh:mm:ss');
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  delete user list
  */
  deleteUserList = async (userIdList: string[] | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!userIdList || (userIdList && userIdList.length === 0)) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      for (const userId of userIdList) {
        if (userId) {
          await mysqlService.userService.delete({
            where: { id: userId },
          });
        }
      }

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = moment(utc()).format('YYYY-MM-DD hh:mm:ss');
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };
}

const userController = new UserController();

export default userController;
