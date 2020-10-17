import RestService from '../../../../commons/restful-service';
import { RestfulService } from '../../../../commons/constants/interfaces';
import menuTypeModel, { MenuType } from './m_menu_type.model';

export default class MenuTypeService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(menuTypeModel);
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
  async init(typeName: string, icon: string) {
    let menuType = (await this.restService.getOne({
      where: { typeName: typeName },
    })) as MenuType;

    if (!menuType) {
      menuType = (await this.restService.postOne(
        {
          typeName: typeName,
          icon: icon,
        },
        null,
      )) as MenuType;
    }

    return menuType;
  }
}
