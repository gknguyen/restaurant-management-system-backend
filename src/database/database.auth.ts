import { Sequelize } from 'sequelize';
import ENV from '../commons/env';

const ORM = new Sequelize(ENV.DB_CONNECTION, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default ORM;
