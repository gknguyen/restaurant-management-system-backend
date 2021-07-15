import Crypto from 'crypto-js';
import jsonwebtoken from 'jsonwebtoken';
import ENV from '../../commons/env';
import { User } from '../../database/database.type';

class AuthService {
  getToken(user: User) {
    return jsonwebtoken.sign(
      {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        loginDateTime: user.loginDateTime,
        userTypeName: user.userType?.name,
      },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN },
    );
  }

  public comparePassword = (loginPass: string, userEncodedPass: string) => {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, ENV.CRYPTO_SECRET);
    if (dencodedPass.toString(Crypto.enc.Utf8) === loginPass) return true;
    else return false;
  };
}

const authService = new AuthService();

export default authService;
