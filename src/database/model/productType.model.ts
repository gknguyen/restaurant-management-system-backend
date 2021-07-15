import sequelize from 'sequelize';
import ORM from '../database.auth';
import { ProductType } from '../database.type';

const ProductTypeModel = ORM.define<ProductType>(
  'product_type',
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
);

export default ProductTypeModel;
