import express from 'express';
import errorHandler from '../../commons/error.handler/errorHandler';
import { Results } from '../../commons/constants/interfaces';
import { STATUS_CODE } from '../../commons/constants/keyValues';
import { client, redisConnected } from '../../configs/redis';

/* ================================================================================== */
/*
get data from redis cache
*/
export function cache(redisKey: string) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = {
        code: 0,
        message: '',
        values: [],
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

              results.code = STATUS_CODE.SUCCESS;
              results.message = 'get data from redis successfully';
              results.values = dataJSON;
              res.status(STATUS_CODE.SUCCESS).send(results);
            } else {
              next();
            }
          });
        } else {
          next();
        }
      } catch (err) {
        results.code = STATUS_CODE.SERVER_ERROR;
        results.message = err.toString();
        res.status(STATUS_CODE.SERVER_ERROR).send(results);
      }

      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    },
  );
}
