import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import RestfulService from '../../../commons/restful';
import RestService from '../../../commons/restful-service';
import userModel, { User } from './s_user.model';
import { Payload } from '../../../commons/constants/interfaces';

const Crypto = require('cryptojs').Crypto;

const saltRounds: number = 10;

class UserService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(userModel);
  }

  /* post */
  postOne(data: any, condition: any) {
    return this.restService.postOne(data, condition);
  }
  postAll(data: any, condition: any) {
    return this.restService.postAll(data, condition);
  }

  /* put */
  putOne(data: any, condition: any) {
    return this.restService.putOne(data, condition);
  }
  putAll(data: any, condition: any) {
    return this.restService.putAll(data, condition);
  }

  /* get */
  getOne(condition: any) {
    return this.restService.getOne(condition);
  }
  getAll(condition: any) {
    return this.restService.getAll(condition);
  }

  /* delete */
  delete(condition: any) {
    return this.restService.delete(condition);
  }
}

const userService = new UserService();

export default userService;
