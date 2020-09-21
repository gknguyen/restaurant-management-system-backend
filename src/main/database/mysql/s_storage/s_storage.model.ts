import { BuildOptions, DataTypes, Model, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import userTypeModel, { UserType } from '../m.user.type/m_user_type.model';
import supplerModel from '../m_suppler/m_suppler.model';

export interface Storage extends Model {
  readonly id: string;
  supplerId: string;
  ingredient: string;
  initialQuantity: number;
  currentQuantity: number;
  unit: string;
  price: number;
  activeStatus: boolean;
  createDateTime: Date;
  editDateTime: Date;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Storage;
};

const storageModel = sequelize.define(
  's_storage',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    supplerId: {
      type: DataTypes.UUID,
      references: {
        model: supplerModel,
        key: 'id',
      },
    },
    ingredient: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    initialQuantity: {
      type: DataTypes.DOUBLE,
    },
    currentQuantity: {
      type: DataTypes.DOUBLE,
    },
    unit: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    activeStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

/** association with user type table */
supplerModel.hasMany(storageModel, {
  sourceKey: 'id',
  foreignKey: 'supplerId',
  as: 'storages',
});
storageModel.belongsTo(supplerModel, {
  targetKey: 'id',
  foreignKey: 'supplerId',
  as: 'suppler',
  onDelete: 'CASCADE',
});

export default storageModel;
