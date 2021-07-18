import express from 'express';
import STATUS_CODE from 'http-status';
import CONSTANTS from '../../../../config/constant';
import errorHandler from '../../../../config/errorHandler';
import DB from '../../../../database/database.service';

const productRouter = express.Router();

/** get APIs */
productRouter.get('/', getProductList());

export default productRouter;

/** ================================================================================== */
/**
function
*/

function getProductList() {
  const result = { ...CONSTANTS.RESULT, function: 'getProductList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const productList = await DB.product.findAll({
      attributes: [
        'id',
        'name',
        'price',
        'unit',
        'amount',
        'activeStatus',
        'image',
        'editDateTime',
      ],
      include: [
        {
          model: DB.productType,
          as: 'productType',
          attributes: ['id', 'name'],
        },
        {
          model: DB.menuType,
          as: 'menuType',
          attributes: ['id', 'name', 'icon'],
        },
      ],
      order: [['editDateTime', 'DESC']],
    });

    if (productList?.length > 0)
      res.status(STATUS_CODE.OK).send(productList.map((product) => product.get({ plain: true })));
    else res.status(STATUS_CODE.NO_CONTENT).send([]);
  });
}
