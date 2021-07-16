import sequelize from 'sequelize';
import ORM from '../database.auth';
import { Product } from '../database.entities';
import MenuTypeModel from './menuType.model';
import ProductTypeModel from './productType.model';
import UserModel from './user.model';

const ProductModel = ORM.define<Product>(
  'product',
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productTypeId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: ProductTypeModel,
        key: 'id',
      },
    },
    menuTypeId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: MenuTypeModel,
        key: 'id',
      },
    },
    name: {
      type: sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    price: {
      type: sequelize.DataTypes.DOUBLE(12, 2),
    },
    unit: {
      type: sequelize.DataTypes.STRING(10),
    },
    amount: {
      type: sequelize.DataTypes.INTEGER,
    },
    description: {
      type: sequelize.DataTypes.TEXT,
    },
    isActive: {
      type: sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    image: {
      type: sequelize.DataTypes.STRING(50),
    },
    createUserId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    editUserId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    freezeTableName: true,
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
);

/** association with product type table */
ProductTypeModel.hasMany(ProductModel, {
  sourceKey: 'id',
  foreignKey: 'productTypeId',
  as: 'productList',
});
ProductModel.belongsTo(ProductTypeModel, {
  targetKey: 'id',
  foreignKey: 'productTypeId',
  as: 'productType',
});

/** association with menu type table */
MenuTypeModel.hasMany(ProductModel, {
  sourceKey: 'id',
  foreignKey: 'menuTypeId',
  as: 'productList',
});
ProductModel.belongsTo(MenuTypeModel, {
  targetKey: 'id',
  foreignKey: 'menuTypeId',
  as: 'menuType',
});

/** association with user table */
ProductModel.belongsTo(UserModel, {
  targetKey: 'id',
  foreignKey: 'createUserId',
  as: 'createUser',
});
ProductModel.belongsTo(UserModel, {
  targetKey: 'id',
  foreignKey: 'editUserId',
  as: 'editUser',
});

export default ProductModel;
