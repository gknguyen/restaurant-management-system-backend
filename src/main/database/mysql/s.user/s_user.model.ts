import { BuildOptions, DataTypes, Model, UUIDV4 } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import userTypeModel, { UserType } from '../m.user.type/m_user_type.model';

export interface User extends Model {
  readonly id: string;
  userTypeId: string;
  username: string;
  password: string;
  loginDateTime: Date;
  authToken: string;
  activeStatus: boolean;
  createDateTime: Date;
  editDateTime: Date;
  userType?: UserType;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User;
};

const userModel = sequelize.define(
  's_user',
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
        key: 'id',
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
) as ModelStatic;

/** association with user type table */
userTypeModel.hasMany(userModel, {
  sourceKey: 'id',
  foreignKey: 'userTypeId',
  as: 'users',
});
userModel.belongsTo(userTypeModel, {
  targetKey: 'id',
  foreignKey: 'userTypeId',
  as: 'userType',
  onDelete: 'CASCADE',
});

export default userModel;
