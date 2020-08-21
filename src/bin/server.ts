import http from 'http';
import app from '../configs/express';
import sequelize from '../configs/sequelize';
import { PORT, AWS_S3_BUCKET_NAME } from '../commons/constants/env';
import debug from 'debug';
import s3 from '../configs/aws-S3';

// tslint:disable-next-line: no-var-requires
const port = normalizePort(PORT);
const server = http.createServer(app);
const logger = debug('restaurant_management_system:server');

/**
Normalize a port into a number, string, or false.
*/
function normalizePort(val: string) {
  const normalizingPort = parseInt(val, 10);
  if (isNaN(normalizingPort)) return val;
  if (normalizingPort >= 0) return normalizingPort;
  return false;
}

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
  const bind = addr ? (typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port) : '';
  logger('Listening on ' + bind);
}

/**
connect to MySQL
*/
sequelize
  .authenticate()
  .then(() => logger('Connected to MySQL'))
  .catch((err: Error) => console.error('Unable to connect to the database:', err));

sequelize.sync({ alter: false, force: false });

/**
connect to S3
*/
s3.headBucket({ Bucket: AWS_S3_BUCKET_NAME })
  .promise()
  .then(() => logger('Connected to S3'))
  .catch((err: Error) => console.error('Unable to connect to the S3:', err.toString()));

/**
start server
*/
app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
