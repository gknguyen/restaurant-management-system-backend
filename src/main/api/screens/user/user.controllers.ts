import userService from '../../../database/s.user/s_user.service';
import { Results } from '../../../../commons/constants/interfaces';
import userTypeModel, {
  UserType,
} from '../../../database/m.user.type/m_user_type.model';
import { User } from '../../../database/s.user/s_user.model';
import STATUS_CODE from 'http-status';
import userTypeService from '../../../database/m.user.type/m_user_type.service';
import moment, { utc } from 'moment-timezone';
import { Op } from 'sequelize';

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
        where: {
          [Op.or]: [
            { username: { [Op.startsWith]: searchValue } },
            { fullName: { [Op.startsWith]: searchValue } },
            { phoneNumber: { [Op.startsWith]: searchValue } },
            { email: { [Op.startsWith]: searchValue } },
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
    fullName: string | null | undefined,
    age: number | null | undefined,
    phoneNumber: string | null | undefined,
    email: string | null | undefined,
    avatar: string | null | undefined,
    createUserId: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (
        !username ||
        !password ||
        !userTypeName ||
        !fullName ||
        !age ||
        !phoneNumber ||
        !email ||
        !createUserId
      ) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

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
          avatar: avatar || null,
          createUserId: createUserId,
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
    userTypeId: string | null | undefined,
    username: string | null | undefined,
    password: string | null | undefined,
    fullName: string | null | undefined,
    age: number | null | undefined,
    phoneNumber: string | null | undefined,
    email: string | null | undefined,
    avatar: string | null | undefined,
    editUserId: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!userId || !editUserId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      await userService.putOne(
        {
          id: userId,
          userTypeId: userTypeId || null,
          username: username || null,
          password: password
            ? Crypto.AES.encrypt(password, 'Secret Passphrase')
            : null,
          fullName: fullName || null,
          age: age || null,
          phoneNumber: phoneNumber || null,
          email: email || null,
          avatar: avatar || null,
          editUserId: editUserId,
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

      for (let x in userIdList) {
        if (userIdList[x]) {
          await userService.delete({
            where: { id: userIdList[x] },
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
