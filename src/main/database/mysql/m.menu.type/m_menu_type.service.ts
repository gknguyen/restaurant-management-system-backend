import RestService from '../../../../commons/restful-service';
import { RestfulService } from '../../../../commons/constants/interfaces';
import menuTypeModel from './m_menu_type.model';

class MenuTypeService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(menuTypeModel);
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

  /** get */
  getOne(condition: any) {
    return this.restService.getOne(condition);
  }
  getAll(condition: any) {
    return this.restService.getAll(condition);
  }

  /** delete */
  delete(condition: any) {
    return this.restService.delete(condition);
  }
}

const menuTypeService = new MenuTypeService();

export default menuTypeService;
