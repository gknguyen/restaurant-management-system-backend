import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import {
  CRYPTO_SECRET,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from '../../../../commons/constants/env';
import { Payload, Results } from '../../../../commons/constants/interfaces';
import userTypeModel from '../../../database/mysql/m.user.type/m_user_type.model';
import { User } from '../../../database/mysql/s.user/s_user.model';
import userService from '../../../database/mysql/s.user/s_user.service';

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
      activeStatus: user.activeStatus,
      loginDateTime: user.loginDateTime,
      userTypeName: user.userType?.typeName,
    } as Payload;
    const secret = JWT_SECRET;
    const options = { expiresIn: JWT_EXPIRES_IN } as jsonwebtoken.SignOptions;
    const token = jsonwebtoken.sign(payload, secret, options);
    return token;
  }

  /** ================================================================================== */
  /**
  verify login password
  */
  comparePassword(loginPass: string, userEncodedPass: string) {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, CRYPTO_SECRET);
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
  login = async (
    loginUsername: string | null | undefined,
    loginPassword: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** chec input */
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

      /** get user infomation */
      const user = (await userService.getOne({
        attributes: [
          'id',
          'username',
          'password',
          'activeStatus',
          'loginDateTime',
          'authToken',
        ],
        where: { username: loginUsername },
        include: [
          {
            model: userTypeModel,
            as: 'userType',
            attributes: ['id', 'typeName'],
          },
        ],
      })) as User;

      /** check if user existed or not */
      if (user) {
        /** check if user is active or not */
        if (user.activeStatus) {
          /** check password */
          const isCorrect = this.comparePassword(loginPassword, user.password);

          if (isCorrect) {
            /** update some information */
            const token = this.getToken(user);
            user['authToken'] = token;
            user['loginDateTime'] = new Date();
            await user.save();

            /** send responses to client-side */
            results.code = STATUS_CODE.OK;
            results.message = 'login successfully';
            results.values = {
              token: token,
              userInfo: {
                username: user.username,
                role: user.userType?.typeName,
              },
            };
            return results;
          } else {
            results.code = STATUS_CODE.PRECONDITION_FAILED;
            results.message = 'password incorrect';
            return results;
          }
        } else {
          results.code = STATUS_CODE.PRECONDITION_FAILED;
          results.message = 'this user is diactived';
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
      /** check token existed or not */
      if (!token) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'token not found';
        return results;
      }

      /** decode token to get user data */
      const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
      const userInfo: Payload | null | undefined = decodedToken?.payload;

      if (!userInfo) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'userInfo in token not found';
        return results;
      }

      /* check token TTL */
      const TTL = Math.round(new Date().getTime() / 1000);
      if (parseInt(decodedToken.payload.exp) < TTL) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'token expired';
        return results;
      }

      /* get user data */
      const userData = (await userService.getOne({
        attributes: ['username', 'authToken'],
        where: { username: userInfo.username },
      })) as User;

      if (!userData) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'userData in DB not found';
        return results;
      }

      /* verify token */
      if (userData.authToken === token) {
        results.code = STATUS_CODE.OK;
        results.message = 'valid token';
        results.values = userInfo;
        return results;
      } else {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'invalid token';
        return results;
      }
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
