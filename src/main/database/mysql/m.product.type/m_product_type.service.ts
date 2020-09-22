import RestService from '../../../../commons/restful-service';
import { RestfulService } from '../../../../commons/constants/interfaces';
import productTypeModel, { ProductType } from './m_product_type.model';

class ProductTypeService implements RestfulService {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(productTypeModel);
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
    let productType = (await this.restService.getOne({
      where: { typeName: typeName },
    })) as ProductType;

    if (!productType) {
      productType = (await this.restService.postOne(
        {
          typeName: typeName,
        },
        null,
      )) as ProductType;
    }

    return productType;
  }
}

const productTypeService = new ProductTypeService();

export default productTypeService;
