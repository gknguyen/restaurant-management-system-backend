import { RestfulService } from '../../../../commons/constants/interfaces';
import RestService from '../../../../commons/restful-service';
import userModel, { User } from './s_user.model';

export default class UserService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(userModel);
  }

  /** table name */
  getTableName() {
    return this.restService.getTableName();
  }

  /** get */
  getOne(condition: any) {
    return this.restService.getOne(condition);
  }
  getAll(condition: any) {
    return this.restService.getAll(condition);
  }

  /** post */
  postOne(data: any, condition: any) {
    return this.restService.postOne(data, condition);
  }
  postAll(data: any, condition: any) {
    return this.restService.postAll(data, condition);
  }

  /** put */
  putOne(data: any, condition: any) {
    return this.restService.putOne(data, condition);
  }
  putAll(data: any, condition: any) {
    return this.restService.putAll(data, condition);
  }

  /** delete */
  delete(condition: any) {
    return this.restService.delete(condition);
  }

  /** init */
  async init(username: string, password: string, userTypeId: string) {
    let user = (await this.restService.getOne({
      where: { username: username },
    })) as User;

    if (!user) {
      user = (await this.restService.postOne(
        {
          userTypeId: userTypeId,
          username: username,
          password: password,
        },
        null,
      )) as User;
    }

    return user;
  }
}
