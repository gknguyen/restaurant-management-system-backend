import STATUS_CODE from 'http-status';
import { Results } from '../../../../commons/constants/interfaces';
import customerService from '../../../database/mysql/m_customer/m_customer.service';
import { Customer } from '../../../database/mysql/m_customer/m_customer.model';

class CustomerController {
  /** ================================================================================== */
  /**
  get customer list
  */
  getCustomerList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** get customer list */
      const customerList = (await customerService.getAll({
        attributes: [
          'id',
          'fullName',
          'phoneNumber',
          'email',
          'address',
          'createDateTime',
        ],
        order: [['createDateTime', 'ASC']],
      })) as Customer[];

      /** return responses */
      if (customerList && customerList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = customerList;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
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

const customerController = new CustomerController();

export default customerController;
