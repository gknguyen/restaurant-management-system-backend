import { DataTypes, Model, BuildOptions, UUIDV4 } from "sequelize";
import sequelize from "../../../configs/sequelize";

export interface MenuType extends Model {
  readonly id: string;
  typeName: string;
  createUserName: string;
  createDateTime: Date;
  updateUserName: string;
  updateDateTime: Date;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MenuType;
};

const menuTypeModel = sequelize.define(
  "m_menu_type",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    typeName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createUserName: {
      type: DataTypes.STRING,
    },
    updateUserName: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: "createDateTime",
    updatedAt: "updateDateTime",
  }
) as ModelStatic;

export default menuTypeModel;
