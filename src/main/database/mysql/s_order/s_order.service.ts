import RestService from '../../../../commons/restful-service';
import { RestfulService } from '../../../../commons/constants/interfaces';
import orderModel from './s_order.model';

class OrderService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(orderModel);
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

  /** find or create */
  getOrPost(condition: any) {
    return this.restService.getOrPost(condition);
  }

  /** create or edit */
  postOrPut(data: any, condition: any) {
    return this.restService.postOrPut(data, condition);
  }
}

const orderService = new OrderService();

export default orderService;
