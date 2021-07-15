import sequelize from 'sequelize';
import ORM from '../database.auth';
import { MenuType } from '../database.type';

const MenuTypeModel = ORM.define<MenuType>(
  'menu_type',
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
    icon: {
      type: sequelize.DataTypes.STRING(50),
    },
  },
  {
    freezeTableName: true,
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
);

export default MenuTypeModel;
