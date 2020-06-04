import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth20');
import keys from './keys';

/* 
set cookie base on this user 
*/
passport.serializeUser((user: any, done: any) => {
  let sessionUser = {
    _id: user.googleID,
    accessToken: user.accesstoken,
    name: user.name,
    pic_url: user.pic_url,
    email: user.email,
  };

  done(null, sessionUser);
});

/*
get cookie & get relevent session data 
*/
passport.deserializeUser((sessionUser: any, done: any) => {
  done(null, sessionUser); /* now can access request.user */
});

passport.use(
  /* google login */
  new GoogleStrategy(
    /* google keys */
    {
      clientID: keys.googleOauth.clientID,
      clientSecret: keys.googleOauth.clientSecret,
      callbackURL: keys.googleOauth.callback,
      passReqToCallback: true,
    },
    (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
      /*save data in session */
      let user = {
        accesstoken: accessToken,
        googleID: profile.id,
        name: profile.displayName,
        pic_url: profile._json.picture,
        email: profile._json.email,
      };

      done(null, user);
    },
  ),
);

export default passport;
