import * as express from "express";
import fs from "fs";
import moment from "moment-timezone";
import os from "os";
import { join } from "path";
import { Results}  from "./interfaces";
import { STATUS_CODE } from "../configs/config";

const errorHandler = (fn: any) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  Promise.resolve()
    .then(() => fn(req, res, next))
    .catch((error: Error) => {
      console.error("errorHandler: ", error.toString());

      /* get current using moment.js */
      const jaMoment = moment().tz("Asia/Ho_Chi_Minh").locale("ja");
      console.log("jaMoment: ", jaMoment.format("YYYY-MM-DD, h:mm:ss a"));

      /* add error to file errorLog.txt */
      fs.appendFile(
        join(__dirname, "/error-log.txt"),

        jaMoment.format("YYYY-MM-DD, h:mm:ss a") +
          "   (" +
          error +
          ")   " +
          req.baseUrl +
          req.path +
          os.EOL,

        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    });
};

export default errorHandler;
