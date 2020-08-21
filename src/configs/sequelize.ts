import { Sequelize } from 'sequelize';
import {
  ORM_DATABASES,
  ORM_USERNAME,
  ORM_PASSWORD,
  ORM_HOST,
  ORM_PORT,
  ORM_DIALECT,
  ORM_LOGGING,
} from '../commons/constants/env';

const sequelize = new Sequelize({
  database: ORM_DATABASES,
  username: ORM_USERNAME,
  password: ORM_PASSWORD,
  host: ORM_HOST,
  port: ORM_PORT,
  dialect: ORM_DIALECT,
  logging: ORM_LOGGING,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    ssl: 'Amazon RDS',
  },
});

export default sequelize;
