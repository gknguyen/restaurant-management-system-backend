import { Results } from '../../../../commons/constants/interfaces';
import menuTypeModel from '../../../database/mysql/m.menu.type/m_menu_type.model';
import productTypeModel from '../../../database/mysql/m.product.type/m_product_type.model';
import { Product } from '../../../database/mysql/s.product/s_product.model';
import productService from '../../../database/mysql/s.product/s_product.service';
import STATUS_CODE from 'http-status';
import { Order } from '../../../database/mysql/s_order/s_order.model';
import orderService from '../../../database/mysql/s_order/s_order.service';
import customService from '../../../database/mysql/m_customer/m_customer.service';
import { Customer } from '../../../database/mysql/m_customer/m_customer.model';
import { OrderDetail } from '../../../database/mysql/s_order_detail/s_order_detail.model';
import orderDetailService from '../../../database/mysql/s_order_detail/s_order_detail.service';

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

      const customer = (await customService.getOne({
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
  create 1 customer
  */
  getOrCreateCustomer = async (
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

      /** find the customer record, if no result, create new record */
      let customer = (await customService.getOne({
        attributes: ['id', 'phoneNumber'],
        where: { phoneNumber: phoneNumber },
      })) as Customer;

      if (!customer)
        customer = (await customService.postOne(
          {
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            address: address,
          },
          null,
        )) as Customer;

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
  createOrder = async (
    customerId: string | null | undefined,
    finalPrice: number | null | undefined,
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

      /** create order record */
      const order = (await orderService.postOne(
        {
          customerId: customerId,
          finalPrice: finalPrice,
          activeStatus: true,
        },
        null,
      )) as Order;

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = order;
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
  createOrderDetailList = async (
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

      /** create list of order detail record */
      for (const orderDetail of orderDetails) {
        const product = (await productService.getOne({
          attributes: ['id', 'name'],
          where: { name: orderDetail.product.name },
        })) as Product;

        if (product) orderDetail.productId = product.id;
        orderDetail.orderId = orderId;
      }

      const orderDetailList = (await orderDetailService.postAll(
        orderDetails,
        null,
      )) as OrderDetail[];

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = orderDetailList;
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
          const product = (await productService.getOne({
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
