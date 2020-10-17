import CustomerService from './m_customer/m_customer.service';
import EmployeeService from './m_employee/m_employee.service';
import FinanceService from './m_finance/m_finance.service';
import SupplerService from './m_suppler/m_suppler.service';
import MenuTypeService from './m.menu.type/m_menu_type.service';
import ProductTypeService from './m.product.type/m_product_type.service';
import UserTypeService from './m.user.type/m_user_type.service';
import OrderService from './s_order/s_order.service';
import OrderDetailService from './s_order_detail/s_order_detail.service';
import StorageService from './s_storage/s_storage.service';
import ProductService from './s.product/s_product.service';
import UserService from './s.user/s_user.service';

class MYSQLService {
  public customerService = new CustomerService();
  public employeeService = new EmployeeService();
  public financeService = new FinanceService();
  public supplerService = new SupplerService();
  public menuTypeService = new MenuTypeService();
  public productTypeService = new ProductTypeService();
  public userTypeService = new UserTypeService();
  public orderService = new OrderService();
  public orderDetailService = new OrderDetailService();
  public storageService = new StorageService();
  public productService = new ProductService();
  public userService = new UserService();
}

const mysqlService = new MYSQLService();

export default mysqlService;
