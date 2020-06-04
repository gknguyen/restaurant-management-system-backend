import debug from 'debug';
import { Sequelize } from 'sequelize';

const logger = debug('restaurant_management_system:server');

const sequelize = new Sequelize({
  database: 'restaurant_management_system',
  username: 'gknguyen',
  password: '123jkndsjkn3242k5453bkj2',
  host: 'mysql-databases.cb9ydlohbhb0.ap-southeast-1.rds.amazonaws.com',
  port: 3306,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    ssl: 'Amazon RDS',
  },
});

sequelize
  .authenticate()
  .then(() => {
    logger('=> Connected to MySQL');
  })
  .catch((err: Error) => {
    return console.error('Unable to connect to the database:', err);
  });

export default sequelize;
