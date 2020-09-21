import debug from 'debug';
import http from 'http';
import { UserTypeName } from '../commons/constants/enum-list';
import {
  AWS_S3_BUCKET_NAME,
  CRYPTO_SECRET,
  MYSQL_HOST,
  PORT,
} from '../commons/constants/env';
import s3 from '../configs/aws-S3';
import app from '../configs/express';
import sequelize from '../configs/sequelize';
import userTypeService from '../main/database/mysql/m.user.type/m_user_type.service';
import userService from '../main/database/mysql/s.user/s_user.service';

// tslint:disable-next-line: no-var-requires
const server = http.createServer(app);
const logger = debug('restaurant_management_system:server');
const Crypto = require('cryptojs').Crypto;

/**
connect to MySQL
*/
sequelize
  .authenticate()
  .then(() => logger('Connected to MySQL: ' + MYSQL_HOST))
  .catch((err: Error) =>
    console.error('Unable to connect to the database:', err.toString()),
  );

sequelize.sync({ alter: false, force: false }).then(async () => {
  const adminRole = await userTypeService.init(UserTypeName.admin);
  const managerRole = await userTypeService.init(UserTypeName.manager);
  const employeeRole = await userTypeService.init(UserTypeName.employee);

  userService.init(
    'admin',
    Crypto.AES.encrypt('admin', CRYPTO_SECRET),
    adminRole.id,
  );
  userService.init(
    'manager',
    Crypto.AES.encrypt('manager', CRYPTO_SECRET),
    managerRole.id,
  );
  userService.init(
    'employee',
    Crypto.AES.encrypt('employee', CRYPTO_SECRET),
    employeeRole.id,
  );
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
