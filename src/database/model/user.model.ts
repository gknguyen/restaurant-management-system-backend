import sequelize from 'sequelize';
import ORM from '../database.auth';
import { User } from '../database.entities';
import UserTypeModel from './userType.model';

const UserModel = ORM.define<User>(
  'user',
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userTypeId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: UserTypeModel,
        key: 'id',
      },
    },
    username: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: sequelize.DataTypes.STRING,
    },
    fullName: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: sequelize.DataTypes.INTEGER,
      validate: {
        isNumeric: true,
      },
    },
    phone: {
      type: sequelize.DataTypes.STRING,
      unique: true,
      validate: {
        isNumeric: true,
      },
    },
    email: {
      type: sequelize.DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    avatar: {
      type: sequelize.DataTypes.STRING,
    },
    loginDateTime: {
      type: sequelize.DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    authToken: {
      type: sequelize.DataTypes.TEXT,
    },
    isActive: {
      type: sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createUserId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    editUserId: {
      type: sequelize.DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    freezeTableName: true,
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
);

/** association with user type table */
UserTypeModel.hasMany(UserModel, {
  sourceKey: 'id',
  foreignKey: 'userTypeId',
  as: 'userList',
});
UserModel.belongsTo(UserTypeModel, {
  targetKey: 'id',
  foreignKey: 'userTypeId',
  as: 'userType',
});

/** association with user table */
UserModel.belongsTo(UserModel, {
  targetKey: 'id',
  foreignKey: 'createUserId',
  as: 'createUser',
});
UserModel.belongsTo(UserModel, {
  targetKey: 'id',
  foreignKey: 'editUserId',
  as: 'editUser',
});

export default UserModel;
