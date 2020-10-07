import STATUS_CODE from 'http-status';
import { Results } from '../../../../commons/constants/interfaces';
import customerModel from '../../../database/mysql/m_customer/m_customer.model';
import { Order } from '../../../database/mysql/s_order/s_order.model';
import orderService from '../../../database/mysql/s_order/s_order.service';

class OrderController {
  /** ================================================================================== */
  /**
  get order list
  */
  getOrderList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const orderList = (await orderService.getAll({
        attributes: ['id', 'finalPrice', 'activeStatus', 'createDateTime'],
        include: [
          {
            model: customerModel,
            as: 'customer',
            attributes: ['id', 'fullName', 'phoneNumber'],
          },
        ],
        order: [['createDateTime', 'DESC']],
      })) as Order[];

      /** return responses */
      if (orderList && orderList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = orderList;
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

const orderController = new OrderController();

export default orderController;
