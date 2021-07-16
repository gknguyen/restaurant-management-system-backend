import sequelize from 'sequelize';
import { ProductTypeName, UserTypeName } from '../commons/enum';

export interface UserType extends sequelize.Model {
  readonly id: number;
  name: UserTypeName;
  createDateTime: Date | string;
  editDateTime: Date | string;
  /** relationship */
  userList?: User[];
}

export interface User extends sequelize.Model {
  readonly id: number;
  userTypeId: number;
  username: string;
  password?: string;
  fullName: string;
  age?: number;
  phone?: string;
  email?: string;
  avatar?: string;
  loginDateTime?: Date | string;
  authToken?: string;
  isActive: boolean;
  createUserId?: number;
  createDateTime: Date | string;
  editUserId?: number;
  editDateTime: Date | string;
  /** relationship */
  userType?: UserType;
}

export interface ProductType extends sequelize.Model {
  readonly id: number;
  name: ProductTypeName;
  createDateTime: Date | string;
  editDateTime: Date | string;
  /** relationship */
  productList?: Product[];
}

export interface MenuType extends sequelize.Model {
  readonly id: number;
  name: string;
  icon?: string;
  createDateTime: Date | string;
  editDateTime: Date | string;
  /** relationship */
  productList?: Product[];
}

export interface Product extends sequelize.Model {
  readonly id: number;
  productTypeId: number;
  menuTypeId: number;
  name: string;
  price?: number;
  unit?: string;
  amount?: number;
  description?: string;
  isActive: boolean;
  image?: string;
  createUserId?: number;
  createDateTime: Date | string;
  editUserId?: number;
  editDateTime: Date | string;
  /** relationship */
  productType: ProductType;
  menuType: MenuType;
}
