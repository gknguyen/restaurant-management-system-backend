import { Client } from "ldapts";
import passport from "passport";
import PassportLocal from "passport-local";

import ldapOptions from "./ldapts-options";

const localVerifyFunction: PassportLocal.VerifyFunction = async (
  username,
  password,
  done
) => {
  // const domain = process.env.DOMAIN || '@geonet.co.jp';
  // const dn = username + domain;
  // const client = new Client(ldapOptions);
  // try {
  //   await client.bind(dn, password);
  done(null, { username, password });
  // } catch (error) {
  //   done(error);
  // } finally {
  //   await client.unbind();
  // }
};

const strategy = new PassportLocal.Strategy(localVerifyFunction);

passport.use(strategy);

const passportLocal = passport.authenticate("local", { session: false });

export default passportLocal;
