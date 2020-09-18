import { Sequelize } from 'sequelize';
import {
  MYSQL_DATABASES,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DIALECT,
} from '../commons/constants/env';

const sequelize = new Sequelize({
  database: MYSQL_DATABASES,
  username: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: MYSQL_DIALECT,
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    ssl: 'Amazon RDS',
  },
});

export default sequelize;
