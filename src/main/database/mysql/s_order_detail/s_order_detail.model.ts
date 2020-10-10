import { DataTypes, Model, BuildOptions, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import customerModel from '../m_customer/m_customer.model';
import productModel, { Product } from '../s.product/s_product.model';
import orderModel from '../s_order/s_order.model';

export interface OrderDetail extends Model {
  readonly id: string;
  orderId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createDateTime: Date;
  editDateTime: Date;
  product: Product;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): OrderDetail;
};

const orderDetailModel = sequelize.define(
  's_order_detail',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    orderId: {
      type: DataTypes.UUID,
      references: {
        model: orderModel,
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: productModel,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

/** association with order table */
orderModel.hasMany(orderDetailModel, {
  sourceKey: 'id',
  foreignKey: 'orderId',
  as: 'orderDetails',
});
orderDetailModel.belongsTo(orderModel, {
  targetKey: 'id',
  foreignKey: 'orderId',
  as: 'order',
  onDelete: 'CASCADE',
});

/** association with product table */
productModel.hasMany(orderDetailModel, {
  sourceKey: 'id',
  foreignKey: 'productId',
  as: 'orderDetails',
});
orderDetailModel.belongsTo(productModel, {
  targetKey: 'id',
  foreignKey: 'productId',
  as: 'product',
  onDelete: 'CASCADE',
});

export default orderDetailModel;
