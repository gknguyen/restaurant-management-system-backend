import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import STATUS_CODE from 'http-status';
import errorHandler from '../../commons/errorHandler';
import { Results, Payload } from '../../commons/constants/interfaces';

export const getVerify = async (token: string | null) => {
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

    /* decode token to get user data */
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
    return results;
  }
};

export function verifyToken() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token: any = req.headers.token;
      const results = await getVerify(token);

      if (results.code !== STATUS_CODE.OK) {
        res.status(results.code).send(results);
        throw results.message;
      } else {
        next();
      }
    },
  );
}
