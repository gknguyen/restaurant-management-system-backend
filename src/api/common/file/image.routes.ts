import express from 'express';
import STATUS_CODE from 'http-status';
import multer from 'multer';
import path from 'path';
import CONSTANTS from '../../../config/constant';
import errorHandler from '../../../config/errorHandler';
import Multer from '../../../config/multer';

const userMulter = new Multer(CONSTANTS.IMAGE.AVATAR_FOLDER_NAME);
const productMulter = new Multer(CONSTANTS.IMAGE.PRODUCT_IMAGE_NAME);
const imageRouter = express.Router();

/** get APIs */
imageRouter.get('/user-avatar/:fileName', getUserAvatar());
imageRouter.get('/product-image/:fileName', getProductImage());

export default imageRouter;

/** ================================================================================== */
/**
FIND / GET functions
*/

function getUserAvatar() {
  const result = { ...CONSTANTS.RESULT, function: 'getUserAvatar()' };
  return errorHandler(result, (req: express.Request, res: express.Response) => {
    const fileName = req.params.fileName;
    res.sendFile(`${userMulter.getFolderPath()}/${fileName}`);
  });
}

function getProductImage() {
  const result = { ...CONSTANTS.RESULT, function: 'getProductImage()' };
  return errorHandler(result, (req: express.Request, res: express.Response) => {
    const fileName = req.params.fileName;
    res.sendFile(`${productMulter.getFolderPath()}/${fileName}`);
  });
}

/** ================================================================================== */
/**
OTHERS functions
*/

export function checkFilesInMulter(multerRequestHandler: express.RequestHandler<any>) {
  const result = { ...CONSTANTS.RESULT, function: 'checkFilesInMulter()' };
  return errorHandler(
    result,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      multerRequestHandler(req, res, (err: any) => {
        if (err) {
          const error: multer.MulterError = err;
          res.status(STATUS_CODE.PRECONDITION_FAILED).send(`${error.code} : ${error}`);
        } else next();
      });
    },
  );
}
