import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import express, { json, urlencoded } from "express";
import fs from "fs";
import helmet from "helmet";
import logger from "morgan";
import passport from "passport";
import path, { join } from "path";
import keys from "../configs/keys";
import router from "./routes";
import authRouter from "../main/authentication/authentication.routes";
import awsS3Router from "../main/amazon.S3/amazon.S3.routes";

const app: express.Application = express();
app.use(bodyParser.json());

loadConfigs();
loadRoutes();
loadViews();

export default app;

function loadRoutes() {
  app.use("/api", router);
  app.use("/auth", authRouter);
  app.use("/awsS3", awsS3Router);
}

function loadViews() {
  app.use(express.static(join(__dirname, "../public")));
}

function loadConfigs() {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
  );
  app.use(
    logger(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[body]',
      {
        stream: accessLogStream,
      }
    )
  );

  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());

  /* init session */
  app.use(
    cookieSession({
      keys: [keys.session_key],
    })
  );

  /* init passport */
  app.use(passport.initialize());
  app.use(passport.session());
}
