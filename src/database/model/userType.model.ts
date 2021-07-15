import sequelize from 'sequelize';
import ORM from '../database.auth';
import { UserType } from '../database.type';

const UserTypeModel = ORM.define<UserType>(
  'user_type',
  {
    id: {
      type: sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.UUIDV4,
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
