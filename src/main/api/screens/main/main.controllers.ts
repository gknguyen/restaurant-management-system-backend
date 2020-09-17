import { Results } from '../../../../commons/constants/interfaces';
import menuTypeModel from '../../../database/mysql/m.menu.type/m_menu_type.model';
import productTypeModel from '../../../database/mysql/m.product.type/m_product_type.model';
import { Product } from '../../../database/mysql/s.product/s_product.model';
import productService from '../../../database/mysql/s.product/s_product.service';
import STATUS_CODE from 'http-status';

class MainController {
  /** ================================================================================== */
  /**
  get product list
  */
  getProductList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const productList = (await productService.getAll({
        attributes: [
          'id',
          'name',
          'price',
          'unit',
          'amount',
          'activeStatus',
          'image',
          'editDateTime',
        ],
        include: [
          {
            model: productTypeModel,
            as: 'productType',
            attributes: ['typeName'],
          },
          {
            model: menuTypeModel,
            as: 'menuType',
            attributes: ['typeName', 'icon'],
          },
        ],
        order: [['editDateTime', 'DESC']],
      })) as Product[];

      if (productList && productList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = productList;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
        results.values = [];
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };
}

const mainController = new MainController();

export default mainController;
