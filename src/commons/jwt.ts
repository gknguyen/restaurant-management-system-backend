import expressJwt from 'express-jwt';
import userService from '../main/mysql-sequelize/s_user/s_user.service';

function jwt() {
  const secret: string = 'ANYKEYSTRING';
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      /* public routes that don't require authentication */
      '/users/authenticate',
      '/users/register',
    ],
  });
}

async function isRevoked(req: any, payload: any, done: any) {
  const user = await userService.getOne('payload.sub');

  /* revoke token if user no longer exists */
  if (!user) {
    return done(null, true);
  }

  done();
}

export default jwt;
