import { DataTypes, Model, BuildOptions, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface Finance extends Model {
  readonly id: string;
  revenue: number;
  expense: number;
  tax: number;
  profit: number;
  createDateTime: Date;
  editDateTime: Date;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Finance;
};

const financeModel = sequelize.define(
  'm_finance',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    revenue: {
      type: DataTypes.DOUBLE,
    },
    expense: {
      type: DataTypes.DOUBLE,
    },
    tax: {
      type: DataTypes.DOUBLE,
    },
    profit: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

export default financeModel;
