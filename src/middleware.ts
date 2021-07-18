import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'os';
import path, { join } from 'path';
import apiRouter from './api/api.routes';
import CONSTANTS from './config/constant';
import ENV from './config/env';
import { initFolders } from './init.data';

const accessLogFilePath = path.join(
  __dirname,
  `../${CONSTANTS.LOG.FOLDER_NAME}/${CONSTANTS.LOG.ACCESS.FOLDER_NAME}/${CONSTANTS.LOG.ACCESS.FILE_NAME}.${CONSTANTS.LOG.ACCESS.FILE_FORMAT}`,
);

const app = express();

initFolders();
loadConfigs();
loadLogs();
loadRoutes();
loadViews();

export default app;

/** ================================================================================== */
/**
functions
*/

function loadLogs() {
  const accessLogStream = fs.createWriteStream(accessLogFilePath, {
    flags: 'a',
  });

  /** HTTP request logger */
  app.use(
    morgan(
      `=================== ${ENV.NODE_ENV === 'production' ? 'prod' : 'dev'} ==================` +
        os.EOL +
        'remote-addr: :remote-addr' +
        os.EOL +
        'remote-user: :remote-user' +
        os.EOL +
        'user-agent: ":user-agent"' +
        os.EOL +
        'date: [:date[clf]]' +
        os.EOL +
        'url: "HTTP/:http-version/:method - :url - :status"' +
        os.EOL +
        'req[header]: :req[header]' +
        os.EOL +
        'res[header]: :res[header]' +
        os.EOL +
        'req[content-length]: :req[content-length]' +
        os.EOL +
        'res[content-length]: :res[content-length]' +
        os.EOL +
        'response-time: :total-time ms',
      {
        stream: accessLogStream,
      },
    ),
  );
}

function loadConfigs() {
  /** secure app by setting various HTTP headers */
  app.use(helmet());

  /** compress HTTP responses. */
  app.use(compression());

  /** for parsing cookies */
  app.use(cookieParser(ENV.COOKIE_SECRET));

  /** for parsing application/json */
  app.use(express.json());

  /** for parsing application/x-www-form-urlencoded */
  app.use(express.urlencoded({ extended: true }));

  /** limit the number of requests in a period of time */
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 5 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: CONSTANTS.MESSAGES.AUTH.TOO_MANY_REQUESTS,
    }),
  );
}

function loadRoutes() {
  app.use('/api', apiRouter);
}

function loadViews() {
  if (fs.existsSync(path.join(__dirname, '../../build'))) {
    /** Serve any static files */
    app.use(express.static(join(__dirname, '../../build')));
    /** Handle React routing, return all requests to React app */
    app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../../build', 'index.html')));
  }
}
