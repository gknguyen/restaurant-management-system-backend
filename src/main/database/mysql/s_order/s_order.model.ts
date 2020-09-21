import { DataTypes, Model, BuildOptions, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import customerModel from '../m_customer/m_customer.model';

export interface Order extends Model {
  readonly id: string;
  customerId: string;
  finalPrice: number;
  activeStatus: boolean;
  createDateTime: Date;
  editDateTime: Date;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Order;
};

const orderModel = sequelize.define(
  's_order',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: customerModel,
        key: 'id',
      },
    },
    finalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    activeStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

/** association with customer table */
customerModel.hasMany(orderModel, {
  sourceKey: 'id',
  foreignKey: 'customerId',
  as: 'orders',
});
orderModel.belongsTo(customerModel, {
  targetKey: 'id',
  foreignKey: 'customerId',
  as: 'customer',
  onDelete: 'CASCADE',
});

export default orderModel;
