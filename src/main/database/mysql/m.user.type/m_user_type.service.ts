import RestService from '../../../../commons/restful-service';
import { RestfulService } from '../../../../commons/constants/interfaces';
import userTypeModel, { UserType } from './m_user_type.model';

export default class UserTypeService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(userTypeModel);
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
  async init(typeName: string) {
    let userType = (await this.restService.getOne({
      where: { typeName: typeName },
    })) as UserType;

    if (!userType) {
      userType = (await this.restService.postOne(
        {
          typeName: typeName,
        },
        null,
      )) as UserType;
    }

    return userType;
  }
}
