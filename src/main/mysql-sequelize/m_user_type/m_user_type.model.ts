import { DataTypes, Model, BuildOptions, UUIDV4 } from "sequelize";
import sequelize from "../../../configs/sequelize";
import { UserTypeName } from "../../../commons/enum-list";

export interface UserType extends Model {
  readonly id: string;
  typeName: UserTypeName;
  createUserName: string;
  createDateTime: Date;
  updateUserName: string;
  updateDateTime: Date;
}

let enums: any = UserTypeName;
let keys: string[] = Object.keys(UserTypeName);
const userTypeNameValues: string[] = [];
for (let i = 0; i < keys.length; i++) {
  let value: string = keys[i];
  userTypeNameValues.push(enums[value]);
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserType;
};

const userTypeModel = sequelize.define(
  "m_user_type",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    typeName: {
      type: DataTypes.ENUM,
      values: userTypeNameValues,
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

export default userTypeModel;