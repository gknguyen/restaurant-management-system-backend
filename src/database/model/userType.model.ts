import sequelize from 'sequelize';
import ORM from '../database.auth';
import { UserType } from '../database.entities';

const UserTypeModel = ORM.define<UserType>(
  'user_type',
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: sequelize.DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
);

export default UserTypeModel;
