import http from 'http';
import app from '../configs/express';
import sequelize from '../configs/sequelize';

// tslint:disable-next-line: no-var-requires
const port = normalizePort(process.env.PORT || '3000');
const server = http.createServer(app);
const debug = require('debug')('untitled-folder:server');

/*
Normalize a port into a number, string, or false.
*/
function normalizePort(val: string) {
  const normalizingPort = parseInt(val, 10);
  if (isNaN(normalizingPort)) {
    return val;
  }
  if (normalizingPort >= 0) {
    return normalizingPort;
  }
  return false;
}

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  /* handle specific listen errors with friendly messages */
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
  debug('Listening on ' + bind);
}

/* 
connect to DB 
*/
sequelize
  .sync({ alter: false, force: false })
  .then(() => {
    console.error('DB sync successfull');
  })
  .catch((err: any) => {
    return console.error('failed to sync', err);
  });

/* 
start server 
*/
app.set('port', port);
server.listen(port, () => {
  console.log('server listening on port', port);
});
server.on('error', onError);
server.on('listening', onListening);
