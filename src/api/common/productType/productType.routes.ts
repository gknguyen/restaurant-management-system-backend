import express from 'express';
import CONSTANTS from '../../../config/constant';
import errorHandler from '../../../config/errorHandler';
import DB from '../../../database/database.service';
import STATUS_CODE from 'http-status';

const productTypeRouter = express.Router();

/** get APIs */
productTypeRouter.get('/', getProductTypeList());
productTypeRouter.get('/:id', getProductType());

/** post APIs */
productTypeRouter.post('/', createProductType());

export default productTypeRouter;

/** ================================================================================== */
/** functions */

function getProductTypeList() {
  const result = { ...CONSTANTS.RESULT, function: 'getProductTypeList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const productTypeList = await DB.productType.findAll({
      attributes: ['id', 'name'],
      order: [['createDateTime', 'ASC']],
    });

    if (productTypeList?.length > 0)
      res
        .status(STATUS_CODE.OK)
        .send(productTypeList.map((productType) => productType.get({ plain: true })));
    else res.status(STATUS_CODE.NO_CONTENT).send([]);
  });
}

function getProductType() {
  const result = { ...CONSTANTS.RESULT, function: 'getProductType()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const productTypeId: string | null | undefined = req.params.id;

    if (!productTypeId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    const productType = await DB.productType.findOne({
      attributes: ['id', 'name'],
      where: { id: productTypeId },
    });

    if (productType) res.status(STATUS_CODE.OK).send(productType.get({ plain: true }));
    else res.status(STATUS_CODE.NO_CONTENT).send(null);
  });
}

function createProductType() {
  const result = { ...CONSTANTS.RESULT, function: 'createProductType()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const typeName = req.body.typeName as string;

    if (!typeName) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    /** check if product type is existed */
    const productType = await DB.productType.findOne({
      attributes: ['id'],
      where: { name: typeName },
    });

    if (productType) {
      result.code = STATUS_CODE.CONFLICT;
      throw CONSTANTS.MESSAGES.HTTP.RESOURCE_EXISTED;
    }

    const newProductType = await DB.productType.create({
      name: typeName,
    });

    res.status(STATUS_CODE.OK).send(newProductType.get({ plain: true }));
  });
}
