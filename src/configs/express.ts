import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import helmet from 'helmet';
import passport from 'passport';
import path, { join } from 'path';
import awsS3Router from '../main/api/general/amazon.S3/amazon.S3.routes';
import authRouter, {
  verifyToken,
} from '../main/api/general/authentication/authentication.routes';
import apiRouter from './routes';

let num = 0;

const app = express();

loadConfigs();
loadRoutes();
loadViews();

export default app;

/** ================================================================================== */
/**
functions
*/

function loadRoutes() {
  app.use('/api', verifyToken(), apiRouter);
  app.use('/auth', authRouter);
  app.use('/awsS3', awsS3Router);
}

function loadViews() {
  app.use(express.static(join(__dirname, '../../build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

function loadConfigs() {
  app.use(compression());
  app.use(json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());

  /** init passport */
  app.use(passport.initialize());
  app.use(passport.session());
}
