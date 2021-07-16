import debug from 'debug';
import http from 'http';
import ENV from './commons/env';
import ORM from './database/database.auth';
import { initData, initFolders } from './init.data';
import app from './middleware';

const server = http.createServer(app);
const logger = debug(ENV.DEBUG);

/** connect to Database */
ORM.sync({ alter: false, force: false });
ORM.authenticate()
  .then(() => logger(`Connected to database: ${ENV.DB_CONNECTION}`))
  .then(() => initData())
  .catch((err) => console.error(`Unable to connect to the database: ${err.toString()}`));

/** start server */
app.set('port', ENV.PORT);
server.listen(ENV.PORT);
server.on('error', onError);
server.on('listening', onListening);

export default server;

/** ================================================================================== */
/** functions */

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof ENV.PORT === 'string' ? `Pipe ${ENV.PORT}` : `Port ${ENV.PORT}`;

  /** handle specific listen errors with friendly messages */
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = addr ? (typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`) : '';
  logger(`Listening on ${bind}`);
}
