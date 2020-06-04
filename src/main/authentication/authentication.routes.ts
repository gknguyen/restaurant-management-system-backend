import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import { Results } from '../../commons/constants/interfaces';
import errorHandler from '../../commons/errorHandler';
import userTypeModel from '../mysql-sequelize/m_user_type/m_user_type.model';
import { User } from '../mysql-sequelize/s_user/s_user.model';
import userService from '../mysql-sequelize/s_user/s_user.service';
import authenticationService from './authentication.service';

const authRouter = Router();

authRouter.post('/login', login_API());

/* ================================================================================== */
/*
login into application
*/
export const login = async (requestBody: any) => {
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
      const status: boolean = authenticationService.comparePassword(loginPassword, user.password);

      if (status) {
        const token = authenticationService.getToken(user);
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
    return results;
  }
};

function login_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestBody: any = req.body;
      const results = await login(requestBody);

      console.log(results);
      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}

export default authRouter;
