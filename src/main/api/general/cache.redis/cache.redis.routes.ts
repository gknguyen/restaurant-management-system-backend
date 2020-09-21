import express from 'express';
import STATUS_CODE from 'http-status';
import { Results } from '../../../../commons/constants/interfaces';
import errorHandler from '../../../../commons/errorLogs/errorHandler';
import { client, redisConnected } from '../../../../configs/redis';

export function cache(redisKey: string) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const results = {
        code: 0,
        message: '',
        values: null,
      } as Results;

      try {
        if (redisConnected) {
          client.get(redisKey, (err, data) => {
            if (err) {
              results.code = STATUS_CODE.NOT_FOUND;
              results.message = err.toString();
              res.status(STATUS_CODE.NOT_FOUND).send(results);
            }
            if (data) {
              const dataJSON = JSON.parse(data);

              results.code = STATUS_CODE.OK;
              results.message = 'get data from redis successfully';
              results.values = dataJSON;
              res.status(STATUS_CODE.OK).send(results);
            } else {
              next();
            }
          });
        } else {
          next();
        }
      } catch (err) {
        results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
        results.message = err.toString();
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(results);
      }

      if (results.code !== STATUS_CODE.OK) {
        throw results.message;
      }
    },
  );
}
