import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../../../commons/constants/env';
import { Payload, Results } from '../../../../commons/constants/interfaces';
import userTypeModel from '../../../database/m.user.type/m_user_type.model';
import { User } from '../../../database/s.user/s_user.model';
import userService from '../../../database/s.user/s_user.service';

const Crypto = require('cryptojs').Crypto;

class AuthenticationController {
  /** ================================================================================== */
  /**
  enocode token
  */
  getToken(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      activeStatus: user.activeStatus,
      loginDateTime: user.loginDateTime,
      userTypeName: user.userType.typeName,
    } as Payload;
    const secret = JWT_SECRET;
    const options: jsonwebtoken.SignOptions = { expiresIn: JWT_EXPIRES_IN };
    const token = jsonwebtoken.sign(payload, secret, options);
    return token;
  }

  /** ================================================================================== */
  /**
  verify login password
  */
  comparePassword(loginPass: string, userEncodedPass: string) {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, 'Secret Passphrase');
    if (dencodedPass === loginPass) {
      return true;
    } else {
      return false;
    }
  }

  /** ================================================================================== */
  /**
  login into application
  */
  login = async (requestBody: any) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const loginUsername: string | null = requestBody.username;
      const loginPassword: string | null = requestBody.password;

      if (!loginUsername) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'loginUsername is missing';
        return results;
      }
      if (!loginPassword) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'loginPassword is missing';
        return results;
      }

      const user = (await userService.getOne({
        attributes: [
          'id',
          'username',
          'password',
          'fullName',
          'age',
          'phoneNumber',
          'email',
          'avatar',
          'activeStatus',
          'loginDateTime',
          'authToken',
        ],
        where: { username: loginUsername },
        include: [
          {
            model: userTypeModel,
            as: 'userType',
            attributes: ['typeName'],
          },
        ],
      })) as User;

      if (user) {
        const status: boolean = this.comparePassword(loginPassword, user.password);

        if (status) {
          const token = this.getToken(user);
          user['authToken'] = token;
          user['loginDateTime'] = new Date();
          await user.save();

          results.code = STATUS_CODE.OK;
          results.message = 'login successfully';
          results.values = token;
          return results;
        } else {
          results.code = STATUS_CODE.PRECONDITION_FAILED;
          results.message = 'password incorrect';
          return results;
        }
      } else {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'user not found';
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
  verify auth token
  */
  getVerify = async (token: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!token) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'token not found';
        return results;
      }

      /** decode token to get user data */
      const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
      const userInfo: Payload | null = decodedToken ? decodedToken.payload : null;

      if (!userInfo) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'userInfo not found';
        return results;
      }

      results.code = STATUS_CODE.OK;
      results.message = 'valid token, valid route';
      results.values = {
        userInfo: userInfo,
        validToken: true,
      };
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };
}

const authenticationController = new AuthenticationController();

export default authenticationController;
