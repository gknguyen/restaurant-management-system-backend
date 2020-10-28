import debug from 'debug';
import http from 'http';
import { ProductTypeName, UserTypeName } from '../commons/constants/enum-list';
import {
  APP_DB_URL,
  AWS_S3_BUCKET_NAME,
  CRYPTO_SECRET,
  PORT,
} from '../commons/constants/env';
import s3 from '../configs/aws-S3';
import sequelize from '../configs/sequelize';
import mysqlService from '../main/database/mysql/mysqlServices';
import app from './express';

// tslint:disable-next-line: no-var-requires
const server = http.createServer(app);
const logger = debug('restaurant_management_system:server');
const Crypto = require('cryptojs').Crypto;

/**
connect to MySQL
*/
sequelize
  .authenticate()
  .then(() => logger('Connected to MySQL: ' + APP_DB_URL))
  .catch((err: Error) =>
    console.error('Unable to connect to the database:', err.toString()),
  );

sequelize
  .sync({ alter: false, force: false })
  .then(() => {
    /** initialize tables */
    mysqlService.customerService.getTableName();
    mysqlService.employeeService.getTableName();
    mysqlService.financeService.getTableName();
    mysqlService.supplerService.getTableName();
    mysqlService.menuTypeService.getTableName();
    mysqlService.productTypeService.getTableName();
    mysqlService.userTypeService.getTableName();
    mysqlService.orderService.getTableName();
    mysqlService.orderDetailService.getTableName();
    mysqlService.storageService.getTableName();
    mysqlService.productService.getTableName();
    mysqlService.userService.getTableName();
  })
  .then(async () => {
    /** create default user roles */
    const adminRole = await mysqlService.userTypeService.init(UserTypeName.admin);
    const managerRole = await mysqlService.userTypeService.init(
      UserTypeName.manager,
    );
    const employeeRole = await mysqlService.userTypeService.init(
      UserTypeName.employee,
    );

    /** create default login users */
    mysqlService.userService.init(
      'admin',
      Crypto.AES.encrypt('admin', CRYPTO_SECRET),
      adminRole.id,
    );
    mysqlService.userService.init(
      'manager',
      Crypto.AES.encrypt('manager', CRYPTO_SECRET),
      managerRole.id,
    );
    mysqlService.userService.init(
      'employee',
      Crypto.AES.encrypt('employee', CRYPTO_SECRET),
      employeeRole.id,
    );

    /** create default product types */
    mysqlService.productTypeService.init(ProductTypeName.food);
    mysqlService.productTypeService.init(ProductTypeName.beverage);
    mysqlService.productTypeService.init(ProductTypeName.service);

    /** create default menu types */
    mysqlService.menuTypeService.init('spring', 'filter_vintage');
    mysqlService.menuTypeService.init('summer', 'waves');
    mysqlService.menuTypeService.init('autumn', 'eco');
    mysqlService.menuTypeService.init('winter', 'ac_unit');
  });

/**
connect to S3
*/
s3.headBucket({ Bucket: AWS_S3_BUCKET_NAME })
  .promise()
  .then(() => logger('Connected to S3: ' + AWS_S3_BUCKET_NAME))
  .catch((err: Error) =>
    console.error('Unable to connect to the S3:', err.toString()),
  );

/**
start server
*/
app.set('port', PORT);
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

/** ================================================================================== */
/**
functions
*/

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  /** handle specific listen errors with friendly messages */
  switch (error.code) {
    case 'EACCES':
      throw new Error(bind + ' requires elevated privileges');
    case 'EADDRINUSE':
      throw new Error(bind + ' is already in use');
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = addr
    ? typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    : '';
  logger('Listening on ' + bind);
}
