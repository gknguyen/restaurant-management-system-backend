import STATUS_CODE from 'http-status';
import { Results } from '../../../../commons/constants/interfaces';
import mysqlService from '../../../database/mysql/mysqlServices';
import customerModel from '../../../database/mysql/m_customer/m_customer.model';
import productModel from '../../../database/mysql/s.product/s_product.model';
import { Order } from '../../../database/mysql/s_order/s_order.model';
import orderDetailModel from '../../../database/mysql/s_order_detail/s_order_detail.model';

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
      const orderList = (await mysqlService.orderService.getAll({
        attributes: [
          'id',
          'finalPrice',
          'activeStatus',
          'createDateTime',
          'editDateTime',
        ],
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

  /** ================================================================================== */
  /**
  get 1 order
  */
  getOrder = async (orderId: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!orderId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : orderId is missing';
        return results;
      }

      /** get record */
      const order = (await mysqlService.orderService.getOne({
        attributes: [
          'id',
          'finalPrice',
          'activeStatus',
          'createDateTime',
          'editDateTime',
        ],
        where: { id: orderId },
        include: [
          {
            model: customerModel,
            as: 'customer',
            attributes: ['id', 'fullName', 'phoneNumber', 'email', 'address'],
          },
          {
            model: orderDetailModel,
            as: 'orderDetails',
            attributes: ['id', 'quantity', 'totalPrice'],
            include: [
              {
                model: productModel,
                as: 'product',
                attributes: ['id', 'name', 'price', 'unit'],
              },
            ],
          },
        ],
      })) as Order;

      /** return responses */
      if (order) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = order;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
        results.values = {};
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
