import passport from "passport";
import PassportJwt from "passport-jwt";

import { User } from "../main/mysql-sequelize/s_user/s_user.model";
import userService from "../main/mysql-sequelize/s_user/s_user.service";

const jwtStrategyOptions: PassportJwt.StrategyOptions = {
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET || "secret"
};

const jwtVerifyCallback: PassportJwt.VerifiedCallback = (
  payload: any,
  done: PassportJwt.VerifiedCallback
) => {
  const user = payload as User;
  done(null, user);
};

const jwtStrategy = new PassportJwt.Strategy(
  jwtStrategyOptions,
  jwtVerifyCallback
);

passport.use(jwtStrategy);

const passportJwt = passport.authenticate("jwt", { session: false });

export default passportJwt;
