import { BuildOptions, DataTypes, Model, UUIDV4 } from 'sequelize';
import sequelize from '../../../configs/sequelize';
import menuTypeModel, { MenuType } from '../m.menu.type/m_menu_type.model';
import productTypeModel, {
  ProductType,
} from '../m.product.type/m_product_type.model';

export interface Product extends Model {
  readonly id: string;
  productTypeId: string;
  menuTypeId: string;
  name: string;
  price: number;
  unit: string;
  amount: number;
  description: string;
  activeStatus: boolean;
  image: string;
  createUserId: string;
  createDateTime: Date;
  editUserId: string;
  editDateTime: Date;
  productType?: ProductType;
  menuType?: MenuType;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Product;
};

const productModel = sequelize.define(
  's_product',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    productTypeId: {
      type: DataTypes.UUID,
      references: {
        model: productTypeModel,
        key: 'id',
      },
    },
    menuTypeId: {
      type: DataTypes.UUID,
      references: {
        model: menuTypeModel,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    unit: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
    activeStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    createUserId: {
      type: DataTypes.STRING,
    },
    editUserId: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

/** association with product type table */
productTypeModel.hasMany(productModel, {
  sourceKey: 'id',
  foreignKey: 'productTypeId',
  as: 'product',
});
productModel.belongsTo(productTypeModel, {
  targetKey: 'id',
  foreignKey: 'productTypeId',
  as: 'productType',
  onDelete: 'CASCADE',
});

/** association with menu type table */
menuTypeModel.hasMany(productModel, {
  sourceKey: 'id',
  foreignKey: 'menuTypeId',
  as: 'product',
});
productModel.belongsTo(menuTypeModel, {
  targetKey: 'id',
  foreignKey: 'menuTypeId',
  as: 'menuType',
  onDelete: 'CASCADE',
});

export default productModel;
