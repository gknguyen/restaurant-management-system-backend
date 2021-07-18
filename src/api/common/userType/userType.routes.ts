import express from 'express';
import CONSTANTS from '../../../config/constant';
import errorHandler from '../../../config/errorHandler';
import DB from '../../../database/database.service';
import STATUS_CODE from 'http-status';

const userTypeRouter = express.Router();

/** get APIs */
userTypeRouter.get('/', getUserTypeList());

/** post APIs */
userTypeRouter.post('/', createUserType());

export default userTypeRouter;

/** ================================================================================== */
/** functions */

function getUserTypeList() {
  const result = { ...CONSTANTS.RESULT, function: 'getUserTypeList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const userTypeList = await DB.userType.findAll({
      attributes: ['id', 'name'],
      order: [['createDateTime', 'ASC']],
    });

    if (userTypeList?.length > 0)
      res
        .status(STATUS_CODE.OK)
        .send(userTypeList.map((userType) => userType.get({ plain: true })));
    else res.status(STATUS_CODE.NO_CONTENT).send([]);
  });
}

function createUserType() {
  const result = { ...CONSTANTS.RESULT, function: 'createUserType()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const typeName = req.body.typeName as string;

    if (!typeName) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    /** check if user type is existed */
    const userType = await DB.userType.findOne({
      attributes: ['id'],
      where: { name: typeName },
    });

    if (userType) {
      result.code = STATUS_CODE.CONFLICT;
      throw CONSTANTS.MESSAGES.HTTP.RESOURCE_EXISTED;
    }

    const newUserType = await DB.userType.create({
      name: typeName,
    });

    res.status(STATUS_CODE.OK).send(newUserType.get({ plain: true }));
  });
}
