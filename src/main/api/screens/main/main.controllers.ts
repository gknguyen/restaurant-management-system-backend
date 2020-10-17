import STATUS_CODE from 'http-status';
import { Results } from '../../../../commons/constants/interfaces';
import menuTypeModel from '../../../database/mysql/m.menu.type/m_menu_type.model';
import productTypeModel from '../../../database/mysql/m.product.type/m_product_type.model';
import mysqlService from '../../../database/mysql/mysqlServices';
import customerModel, {
  Customer,
} from '../../../database/mysql/m_customer/m_customer.model';
import productModel, {
  Product,
} from '../../../database/mysql/s.product/s_product.model';
import { Order } from '../../../database/mysql/s_order/s_order.model';
import orderDetailModel, {
  OrderDetail,
} from '../../../database/mysql/s_order_detail/s_order_detail.model';

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
      const productList = (await mysqlService.productService.getAll({
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

      /** return responses */
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

  /** ================================================================================== */
  /**
  search 1 customer
  */
  searchCustomer = async (searchValue: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!searchValue) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : searchValue is missing';
        return results;
      }

      const customer = (await mysqlService.customerService.getOne({
        attributes: ['id', 'fullName', 'phoneNumber', 'email', 'address'],
        where: { phoneNumber: searchValue },
      })) as Customer;

      /** return responses */
      if (customer) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = customer;
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

  /** ================================================================================== */
  /**
  get unpaid order list
  */
  getUnpaidOrderList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const orderList = (await mysqlService.orderService.getAll({
        attributes: ['id', 'no', 'finalPrice', 'activeStatus'],
        where: { activeStatus: true },
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
        order: [['createDateTime', 'ASC']],
      })) as Order[];

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
  create 1 customer
  */
  createOrEditCustomer = async (
    customerId: string | null | undefined,
    fullName: string | null | undefined,
    phoneNumber: string | null | undefined,
    email: string | null | undefined,
    address: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!fullName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : fullName is missing';
        return results;
      }
      if (!phoneNumber) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : phoneNumber is missing';
        return results;
      }
      if (!email) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : email is missing';
        return results;
      }
      if (!address) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : address is missing';
        return results;
      }

      /** create of edit customer record */
      await mysqlService.customerService.postOrPut(
        {
          id: customerId || undefined,
          fullName: fullName,
          phoneNumber: phoneNumber,
          email: email,
          address: address,
        },
        null,
      );

      /** get the selected customer record */
      const customer = (await mysqlService.customerService.getOne({
        attributes: ['id', 'phoneNumber'],
        where: { phoneNumber: phoneNumber },
      })) as Customer;

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = customer;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  create 1 order
  */
  createOrEditOrder = async (
    orderId: string | null | undefined,
    customerId: string | null | undefined,
    no: number | null | undefined,
    finalPrice: number | null | undefined,
    activeStatus: boolean | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!customerId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : customerId is missing';
        return results;
      }
      if (!finalPrice) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : finalPrice is missing';
        return results;
      }
      if (activeStatus === null || activeStatus === undefined) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : activeStatus is missing';
        return results;
      }

      /** create or edit order record */
      if (orderId) {
        await mysqlService.orderService.putOne(
          {
            id: orderId,
            customerId: customerId,
            finalPrice: finalPrice,
            activeStatus: activeStatus,
          },
          null,
        );
      } else {
        const order = (await mysqlService.orderService.postOne(
          {
            customerId: customerId,
            finalPrice: finalPrice,
            activeStatus: activeStatus,
          },
          null,
        )) as Order;
        orderId = order.id;
      }

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = { id: orderId };
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  create order detail list
  */
  createOrEditOrderDetailList = async (
    orderId: string | null | undefined,
    orderDetails: OrderDetail[] | null | undefined,
  ) => {
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
      if (!orderDetails || (orderDetails && orderDetails.length === 0)) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : orderDetailList is missing';
        return results;
      }

      /** create or update list of order detail record */
      for (const orderDetail of orderDetails) {
        const product = (await mysqlService.productService.getOne({
          attributes: ['id', 'name'],
          where: { name: orderDetail.product.name },
        })) as Product;

        if (product) orderDetail.productId = product.id;
        orderDetail.orderId = orderId;

        mysqlService.orderDetailService.postOrPut(orderDetail, null);
      }

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  reduce the amount of selected products in order
  */
  reduceQuantityOfSelectedProducts = async (
    orderDetails: OrderDetail[] | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!orderDetails || (orderDetails && orderDetails.length === 0)) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input : orderDetailList is missing';
        return results;
      }

      /** updata quantity */
      for (const orderDetail of orderDetails) {
        if (orderDetail) {
          const product = (await mysqlService.productService.getOne({
            attributes: ['id', 'name', 'amount'],
            where: { name: orderDetail.product.name },
          })) as Product;

          if (product) product.amount -= orderDetail.quantity;

          product.save();
        }
      }

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      return results;
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
