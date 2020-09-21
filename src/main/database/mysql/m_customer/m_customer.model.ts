import { DataTypes, Model, BuildOptions, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface Customer extends Model {
  readonly id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  createDateTime: Date;
  editDateTime: Date;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Customer;
};

const customerModel = sequelize.define(
  'm_customer',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

export default customerModel;
