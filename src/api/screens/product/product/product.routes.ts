import express from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import sequelize from 'sequelize';
import CONSTANTS from '../../../../commons/constant';
import errorHandler from '../../../../commons/errorHandler';
import Multer, { checkFilesInMulter } from '../../../../commons/multer';
import DB from '../../../../database/database.service';

const productMulter = new Multer('products');
const productScreenRouter = express.Router();

/** get APIs */
productScreenRouter.get('/', getProductList());
productScreenRouter.get('/:id', getProduct());

/** post APIs */
productScreenRouter.post('/search', searchProductList());
productScreenRouter.post(
  '/',
  checkFilesInMulter(productMulter.downloadFile.single('file')),
  createProduct(),
);

/** patch APIs */
productScreenRouter.patch(
  '/:id',
  productMulter.downloadFile.single('file'),
  editProduct(),
  getProduct(),
);

/** delete APIs */
productScreenRouter.delete('/:id', deleteProduct());

export default productScreenRouter;

/** ================================================================================== */
/**
function
*/

function getProductList() {
  const result = { ...CONSTANTS.RESULT, function: 'getProductList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const productList = await DB.product.findAll({
      attributes: ['id', 'name', 'price', 'unit', 'amount', 'isActive', 'editDateTime'],
      include: [
        {
          model: DB.productType,
          as: 'productType',
          attributes: ['id', 'name'],
        },
        {
          model: DB.menuType,
          as: 'menuType',
          attributes: ['id', 'name'],
        },
      ],
      order: [['editDateTime', 'DESC']],
    });

    if (productList?.length > 0)
      res.status(STATUS_CODE.OK).send(productList.map((product) => product.get({ plain: true })));
    else res.status(STATUS_CODE.NO_CONTENT).send([]);
  });
}

function getProduct() {
  const result = { ...CONSTANTS.RESULT, function: 'getProduct()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const productId = req.params.id;

    if (!productId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    const product = await DB.product.findOne({
      attributes: ['id', 'name', 'price', 'unit', 'amount', 'isActive', 'image', 'description'],
      where: { id: productId },
      include: [
        {
          model: DB.productType,
          as: 'productType',
          attributes: ['id', 'name'],
        },
        {
          model: DB.menuType,
          as: 'menuType',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (product) res.status(STATUS_CODE.OK).send(product.get({ plain: true }));
    else res.status(STATUS_CODE.NO_CONTENT).send(null);
  });
}

function searchProductList() {
  const result = { ...CONSTANTS.RESULT, function: 'searchProductList()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const searchValue = req.body.searchValue;

    const productList = await DB.product.findAll({
      attributes: ['id', 'name', 'price', 'unit', 'amount', 'isActive', 'editDateTime'],
      where: {
        [sequelize.Op.or]: [
          { name: { [sequelize.Op.startsWith]: searchValue } },
          { price: { [sequelize.Op.startsWith]: searchValue } },
          { unit: { [sequelize.Op.startsWith]: searchValue } },
          { amount: { [sequelize.Op.startsWith]: searchValue } },
          { activeStatus: { [sequelize.Op.startsWith]: searchValue } },
        ],
      },
      include: [
        {
          model: DB.productType,
          as: 'productType',
          attributes: ['id', 'name'],
        },
        {
          model: DB.menuType,
          as: 'menuType',
          attributes: ['id', 'name'],
        },
      ],
      order: [['editDateTime', 'DESC']],
    });

    if (productList?.length > 0)
      res.status(STATUS_CODE.OK).send(productList.map((product) => product.get({ plain: true })));
    else {
      const productList = await DB.product.findAll({
        attributes: ['id', 'name', 'price', 'unit', 'amount', 'isActive', 'editDateTime'],
        include: [
          {
            model: DB.productType,
            as: 'productType',
            attributes: ['id', 'name'],
            where: { name: { [sequelize.Op.startsWith]: searchValue } },
          },
          {
            model: DB.menuType,
            as: 'menuType',
            attributes: ['id', 'name'],
          },
        ],
        order: [['editDateTime', 'DESC']],
      });

      if (productList?.length > 0)
        res.status(STATUS_CODE.OK).send(productList.map((product) => product.get({ plain: true })));
      else {
        const productList = await DB.product.findAll({
          attributes: ['id', 'name', 'price', 'unit', 'amount', 'isActive', 'editDateTime'],
          include: [
            {
              model: DB.productType,
              as: 'productType',
              attributes: ['id', 'name'],
            },
            {
              model: DB.menuType,
              as: 'menuType',
              attributes: ['id', 'name'],
              where: { name: { [sequelize.Op.startsWith]: searchValue } },
            },
          ],
          order: [['editDateTime', 'DESC']],
        });

        if (productList?.length > 0)
          res
            .status(STATUS_CODE.OK)
            .send(productList.map((product) => product.get({ plain: true })));
        else res.status(STATUS_CODE.NO_CONTENT).send([]);
      }
    }
  });
}

function createProduct() {
  const result = { ...CONSTANTS.RESULT, function: 'createProduct()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const token = req.headers.token as string;
    const userInfo = jsonwebtoken.decode(token);
    const loginUserId = (userInfo as jsonwebtoken.JwtPayload)?.id;

    const file = req.file;

    const productTypeName = req.body.productTypeName;
    const menuTypeName = req.body.menuTypeName;
    const name = req.body.name;
    const price = req.body.price;
    const unit = req.body.unit;
    const amount = req.body.amount;
    const description = req.body.description;

    if (
      !productTypeName ||
      !menuTypeName ||
      !name ||
      !price ||
      !unit ||
      !amount ||
      !file ||
      !loginUserId
    ) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    /** check if product is existed */
    const product = await DB.product.findOne({
      attributes: ['id'],
      where: { name: name },
    });

    if (product) {
      result.code = STATUS_CODE.CONFLICT;
      throw CONSTANTS.MESSAGES.HTTP.RESOURCE_EXISTED;
    }

    /** get product type id */
    const productType = await DB.productType.findOne({
      attributes: ['id'],
      where: { name: productTypeName },
    });

    if (!productType) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.INVALID.PARAMS;
    }

    /** get menu type id */
    const menuType = await DB.menuType.findOne({
      attributes: ['id'],
      where: { name: menuTypeName },
    });

    if (!menuType) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.INVALID.PARAMS;
    }

    const newProduct = await DB.product.create({
      productTypeId: productType.id,
      menuTypeId: menuType.id,
      name: name,
      price: price,
      unit: unit,
      amount: amount,
      description: description || null,
      image: file.originalname,
      createUserId: loginUserId,
    });

    res.status(STATUS_CODE.OK).send(newProduct.get({ plain: true }));
  });
}

function editProduct() {
  const result = { ...CONSTANTS.RESULT, function: 'editProduct()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token);
      const loginUserId = (userInfo as jsonwebtoken.JwtPayload)?.id;

      const file = req.file;

      const productId = req.params.Id;

      const productTypeName = req.body.productTypeName;
      const menuTypeName = req.body.menuTypeName;
      const name = req.body.name;
      const price = req.body.price;
      const unit = req.body.unit;
      const amount = req.body.amount;
      const description = req.body.description;

      if (!productId || !productTypeName || !menuTypeName || !loginUserId) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
      }

      /** get product type id */
      const productType = await DB.productType.findOne({
        attributes: ['id'],
        where: { name: productTypeName },
      });

      if (!productType) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw CONSTANTS.MESSAGES.HTTP.INVALID.PARAMS;
      }

      /** get menu type id */
      const menuType = await DB.menuType.findOne({
        attributes: ['id'],
        where: { name: menuTypeName },
      });

      if (!menuType) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw CONSTANTS.MESSAGES.HTTP.INVALID.PARAMS;
      }

      await DB.product.update(
        {
          productTypeId: productType.id,
          menuTypeId: menuType.id,
          name: name || null,
          price: price || null,
          unit: unit || null,
          amount: amount || null,
          activeStatus: amount && amount > 0,
          description: description || null,
          image: file?.originalname || null,
          editUserId: loginUserId,
        },
        {
          where: { id: productId },
        },
      );

      next();
    },
  );
}

function deleteProduct() {
  const result = { ...CONSTANTS.RESULT, function: 'deleteProduct()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    const productId = req.params.id;

    if (!productId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw CONSTANTS.MESSAGES.HTTP.REQUIRED.PARAMS;
    }

    await DB.product.destroy({
      where: { id: productId },
    });

    res.status(STATUS_CODE.OK).send(null);
  });
}
