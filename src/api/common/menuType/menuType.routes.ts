import express from 'express';
import CONSTANTS from '../../../config/constant';
import errorHandler from '../../../config/errorHandler';
import DB from '../../../database/database.service';
import STATUS_CODE from 'http-status';

const menuTypeRouter = express.Router();

/** get APIs */
menuTypeRouter.get('/', getMenuTypeList());
menuTypeRouter.get('/:id', getMenuType());

/** post APIs */
menuTypeRouter.post('/', createMenuType());

export default menuTypeRouter;

/** ================================================================================== */
/** functions */

function getMenuTypeList() {
  const result = { ...CONSTANTS.RESULT, function: 'getMenuTypeList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const menuTypeList = await DB.menuType.findAll({
      attributes: ['id', 'name', 'icon'],
      order: [['createDateTime', 'ASC']],
    });

    if (menuTypeList?.length > 0)
      res
        .status(STATUS_CODE.OK)
        .send(menuTypeList.map((menuType) => menuType.get({ plain: true })));
    else res.status(STATUS_CODE.NO_CONTENT).send([]);
  });
}

function getMenuType() {
  const result = { ...CONSTANTS.RESULT, function: 'getMenuType()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const menuTypeId: string | null | undefined = req.params.id;

    if (!menuTypeId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    const menuType = await DB.menuType.findOne({
      attributes: ['id', 'name', 'icon'],
      where: { id: menuTypeId },
    });

    if (menuType) res.status(STATUS_CODE.OK).send(menuType.get({ plain: true }));
    else res.status(STATUS_CODE.NO_CONTENT).send(null);
  });
}

function createMenuType() {
  const result = { ...CONSTANTS.RESULT, function: 'createMenuType()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const typeName = req.body.typeName as string;

    if (!typeName) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    /** check if menu type is existed */
    const menuType = await DB.menuType.findOne({
      attributes: ['id'],
      where: { name: typeName },
    });

    if (menuType) {
      result.code = STATUS_CODE.CONFLICT;
      throw CONSTANTS.MESSAGES.HTTP.RESOURCE_EXISTED;
    }

    const newMenuType = await DB.menuType.create({
      name: typeName,
    });

    res.status(STATUS_CODE.OK).send(newMenuType.get({ plain: true }));
  });
}
