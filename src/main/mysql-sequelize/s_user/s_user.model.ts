import { BuildOptions, DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../../../configs/sequelize";
import userTypeModel from "../m_user_type/m_user_type.model";

export interface User extends Model {
  readonly id: string;
  userTypeId: string;
  username: string;
  password: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  email: string;
  avatar: string;
  loginDateTime: Date;
  authToken: string;
  activeStatus: boolean;
  createUserId: string;
  createDateTime: Date;
  editUserId: string;
  editDateTime: Date;
  userType?: any;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User;
};

const userModel = sequelize.define(
  "s_user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    userTypeId: {
      type: DataTypes.UUID,
      references: {
        model: userTypeModel,
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    loginDateTime: {
      type: DataTypes.DATE,
    },
    authToken: {
      type: DataTypes.TEXT,
    },
    activeStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createUserId: {
      type: DataTypes.STRING,
    },
    editUserId: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: "createDateTime",
    updatedAt: "editDateTime",
  }
) as ModelStatic;

/* association with user type table */
userTypeModel.hasMany(userModel, {
  sourceKey: "id",
  foreignKey: "userTypeId",
  as: "user",
});
userModel.belongsTo(userTypeModel, {
  targetKey: "id",
  foreignKey: "userTypeId",
  as: "userType",
  onDelete: "CASCADE",
});

export default userModel;
