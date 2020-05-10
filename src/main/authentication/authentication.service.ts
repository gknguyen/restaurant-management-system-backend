import jsonwebtoken from "jsonwebtoken";
import { Payload } from "../../commons/interfaces";
import { User } from "../mysql-sequelize/s_user/s_user.model";

const Crypto = require("cryptojs").Crypto;

class AuthenticationService {
  /* enocode token */
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
    const secret = process.env.SECRET || "secret";
    const options: jsonwebtoken.SignOptions = { expiresIn: "12h" };
    const token = jsonwebtoken.sign(payload, secret, options);
    return token;
  }

  /* verify login password */
  comparePassword(loginPass: string, userEncodedPass: string) {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, "Secret Passphrase");
    if (dencodedPass === loginPass) {
      return true;
    } else {
      return false;
    }
  }
}

const authenticationService = new AuthenticationService();

export default authenticationService;
