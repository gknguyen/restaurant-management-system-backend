import { DataTypes, Model, BuildOptions, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface Suppler extends Model {
  readonly id: string;
  name: string;
  phoneNumber: string;
  activeStatus: boolean;
  createDateTime: Date;
  editDateTime: Date;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Suppler;
};

const supplerModel = sequelize.define(
  'm_suppler',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

export default supplerModel;
