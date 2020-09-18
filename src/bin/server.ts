import debug from 'debug';
import http from 'http';
import { AWS_S3_BUCKET_NAME, MYSQL_HOST, PORT } from '../commons/constants/env';
import s3 from '../configs/aws-S3';
import app from '../configs/express';
import sequelize from '../configs/sequelize';

// tslint:disable-next-line: no-var-requires
const server = http.createServer(app);
const logger = debug('restaurant_management_system:server');

/**
connect to MySQL
*/
sequelize
  .authenticate()
  .then(() => logger('Connected to MySQL: ' + MYSQL_HOST))
  .catch((err: Error) =>
    console.error('Unable to connect to the database:', err.toString()),
  );

sequelize.sync({ alter: false, force: false });

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
