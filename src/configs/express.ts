import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express, { json } from 'express';
import fs from 'fs';
import helmet from 'helmet';
import logger from 'morgan';
import os from 'os';
import passport from 'passport';
import path, { join } from 'path';
import { getFilesizeInBytes } from '../commons/utils/getFileSize';
import keys from '../configs/keys';
import awsS3Router from '../main/amazon.S3/amazon.S3.routes';
import authRouter from '../main/authentication/authentication.routes';
import { verifyToken } from '../main/verifyToken/verifyToken.routes';
import apiRouter from './routes';

let num = 0;

const app: express.Application = express();

loadConfigs();
loadRoutes();
loadViews();

export default app;

/* ================================================================================== */
/*
functions
*/
function loadRoutes() {
  app.use('/api', verifyToken(), apiRouter);
  app.use('/auth', authRouter);
  app.use('/awsS3', awsS3Router);
}

function loadViews() {
  app.use(express.static(join(__dirname, '../public')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

function loadConfigs() {
  /* check file size */
  let fileSize = getFilesizeInBytes(join(__dirname, '/accessLog/access' + num + '.log'));
  while (fileSize > 10) {
    num++;
    fileSize = getFilesizeInBytes(join(__dirname, '/accessLog/access' + num + '.log'));
  }

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '/accessLog/access' + num + '.log'),
    {
      flags: 'a',
    },
  );

  app.use(
    logger(
      '============================================================================================' +
        os.EOL +
        'remote-addr: ' +
        ':remote-addr' +
        os.EOL +
        'remote-user: ' +
        ':remote-user' +
        os.EOL +
        'date: ' +
        '[:date[clf]]' +
        os.EOL +
        'method: ' +
        '":method :url HTTP/:http-version"' +
        os.EOL +
        'status: ' +
        ':status :res[content-length]' +
        os.EOL +
        'referrer: ' +
        '":referrer"' +
        os.EOL +
        'user-agent: ' +
        '":user-agent"' +
        os.EOL +
        'req[query]: ' +
        ':req[query]' +
        os.EOL +
        'req[body]: ' +
        ':req[body]' +
        os.EOL,
      {
        stream: accessLogStream,
      },
    ),
  );

  app.use(compression());
  app.use(json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());

  /* init session */
  app.use(
    cookieSession({
      keys: [keys.session_key],
    }),
  );

  /* init passport */
  app.use(passport.initialize());
  app.use(passport.session());
}
