import express from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import CONSTANTS from '../../commons/constant';
import errorHandler from '../../commons/errorHandler';
import DB from '../../database/database.service';
import authService from './auth.service';

const authRouter = express.Router();

/** post APIs */
authRouter.post('/login', login());

export default authRouter;

/** ================================================================================== */
/** functions */

function login() {
  const result = { ...CONSTANTS.RESULT, function: 'login()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const loginUsername = req.body.username;
    const loginPassword = req.body.password;

    if (!loginUsername || !loginPassword) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    const user = await DB.user.findOne({
      attributes: [
        'id',
        'username',
        'password',
        'fullName',
        'age',
        'phone',
        'email',
        'avatar',
        'isActive',
        'loginDateTime',
        'authToken',
      ],
      where: { username: loginUsername },
      include: [
        {
          model: DB.userType,
          as: 'userType',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      result.code = STATUS_CODE.UNAUTHORIZED;
      throw CONSTANTS.MESSAGES.AUTH.USER_NOT_FOUND;
    }

    if (!user.isActive) {
      result.code = STATUS_CODE.UNAUTHORIZED;
      throw CONSTANTS.MESSAGES.AUTH.USER_DIACTIVED;
    }

    const isPass = authService.comparePassword(loginPassword, user.password || '');

    if (!isPass) {
      result.code = STATUS_CODE.UNAUTHORIZED;
      throw CONSTANTS.MESSAGES.AUTH.PASS_INCORRECT;
    }

    const token = authService.getToken(user);
    user.authToken = token;
    user.loginDateTime = new Date();
    user.save();

    res.status(STATUS_CODE.OK).send({ token });
  });
}

export function verifyToken() {
  const result = { ...CONSTANTS.RESULT, function: 'verifyToken()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;

      if (!token) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw CONSTANTS.MESSAGES.TOKEN.NOT_FOUND;
      }

      const decodedToken = jsonwebtoken.decode(token, { complete: true });
      const userInfo = decodedToken?.payload;

      if (!decodedToken || !userInfo) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw CONSTANTS.MESSAGES.TOKEN.PAYLOAD_INVALID;
      }

      /* check token TTL */
      const TTL = Math.round(new Date().getTime() / 1000);
      if ((decodedToken.payload.exp || 0) < TTL) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw CONSTANTS.MESSAGES.TOKEN.EXPIRED;
      }

      const userData = await DB.user.findOne({
        attributes: ['username', 'authToken'],
        where: { username: userInfo.username },
      });

      if (!userData) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw CONSTANTS.MESSAGES.TOKEN.DATA_INVALID;
      }

      if (userData.authToken !== token) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw CONSTANTS.MESSAGES.TOKEN.INVALID;
      }

      next();
    },
  );
}
