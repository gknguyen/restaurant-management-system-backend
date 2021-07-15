import MenuTypeModel from './model/menuType.model';
import ProductModel from './model/product.model';
import ProductTypeModel from './model/productType.model';
import UserModel from './model/user.model';
import UserTypeModel from './model/userType.model';

class DatabaseService {
  public userType = UserTypeModel;
  public user = UserModel;

  public productType = ProductTypeModel;
  public menuType = MenuTypeModel;
  public product = ProductModel;
}

const DB = new DatabaseService();

export default DB;
