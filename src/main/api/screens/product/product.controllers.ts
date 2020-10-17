import STATUS_CODE from 'http-status';
import moment, { utc } from 'moment-timezone';
import { Op } from 'sequelize';
import { Results } from '../../../../commons/constants/interfaces';
import menuTypeModel, {
  MenuType,
} from '../../../database/mysql/m.menu.type/m_menu_type.model';
import productTypeModel, {
  ProductType,
} from '../../../database/mysql/m.product.type/m_product_type.model';
import mysqlService from '../../../database/mysql/mysqlServices';
import { Product } from '../../../database/mysql/s.product/s_product.model';

class ProductController {
  /** ================================================================================== */
  /**
  get product list
  */
  getProductList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const productList = (await mysqlService.productService.getAll({
        attributes: [
          'id',
          'name',
          'price',
          'unit',
          'amount',
          'activeStatus',
          'editDateTime',
        ],
        include: [
          {
            model: productTypeModel,
            as: 'productType',
            attributes: ['typeName'],
          },
          {
            model: menuTypeModel,
            as: 'menuType',
            attributes: ['typeName'],
          },
        ],
        order: [['editDateTime', 'DESC']],
      })) as Product[];

      if (productList && productList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = productList;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
        results.values = [];
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  get 1 product by id
  */
  getProduct = async (productId: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (!productId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'productId is missing';
        return results;
      }

      const product = (await mysqlService.productService.getOne({
        attributes: [
          'id',
          'name',
          'price',
          'unit',
          'amount',
          'activeStatus',
          'image',
          'description',
        ],
        where: { id: productId },
        include: [
          {
            model: productTypeModel,
            as: 'productType',
            attributes: ['id', 'typeName'],
          },
          {
            model: menuTypeModel,
            as: 'menuType',
            attributes: ['id', 'typeName'],
          },
        ],
      })) as Product;

      if (product) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = product;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no resulr';
        results.values = {};
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  search product list
  */
  searchProductList = async (searchValue: any | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const productList = (await mysqlService.productService.getAll({
        attributes: [
          'id',
          'name',
          'price',
          'unit',
          'amount',
          'activeStatus',
          'editDateTime',
        ],
        where: {
          [Op.or]: [
            { name: { [Op.startsWith]: searchValue } },
            { price: { [Op.startsWith]: searchValue } },
            { unit: { [Op.startsWith]: searchValue } },
            { amount: { [Op.startsWith]: searchValue } },
            { activeStatus: { [Op.startsWith]: searchValue } },
          ],
        },
        include: [
          {
            model: productTypeModel,
            as: 'productType',
            attributes: ['typeName'],
          },
          {
            model: menuTypeModel,
            as: 'menuType',
            attributes: ['typeName'],
          },
        ],
        order: [['editDateTime', 'DESC']],
      })) as Product[];

      if (productList && productList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = productList;
        return results;
      } else {
        const productList = (await mysqlService.productService.getAll({
          attributes: [
            'id',
            'name',
            'price',
            'unit',
            'amount',
            'activeStatus',
            'editDateTime',
          ],
          include: [
            {
              model: productTypeModel,
              as: 'productType',
              attributes: ['typeName'],
              where: { typeName: { [Op.startsWith]: searchValue } },
            },
            {
              model: menuTypeModel,
              as: 'menuType',
              attributes: ['typeName'],
            },
          ],
          order: [['editDateTime', 'DESC']],
        })) as Product[];

        if (productList && productList.length > 0) {
          results.code = STATUS_CODE.OK;
          results.message = 'successfully';
          results.values = productList;
          return results;
        } else {
          const productList = (await mysqlService.productService.getAll({
            attributes: [
              'id',
              'name',
              'price',
              'unit',
              'amount',
              'activeStatus',
              'editDateTime',
            ],
            include: [
              {
                model: productTypeModel,
                as: 'productType',
                attributes: ['typeName'],
              },
              {
                model: menuTypeModel,
                as: 'menuType',
                attributes: ['typeName'],
                where: { typeName: { [Op.startsWith]: searchValue } },
              },
            ],
            order: [['editDateTime', 'DESC']],
          })) as Product[];

          if (productList && productList.length > 0) {
            results.code = STATUS_CODE.OK;
            results.message = 'successfully';
            results.values = productList;
            return results;
          } else {
            results.code = STATUS_CODE.OK;
            results.message = 'no result';
            results.values = [];
            return results;
          }
        }
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  create 1 product
  */
  createProduct = async (
    productTypeName: string | null | undefined,
    menuTypeName: string | null | undefined,
    name: string | null | undefined,
    price: number | null | undefined,
    unit: string | null | undefined,
    amount: number | null | undefined,
    description: string | null | undefined,
    image: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check input */
      if (
        !productTypeName ||
        !menuTypeName ||
        !name ||
        !price ||
        !unit ||
        !amount ||
        !image
      ) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      /** get product type id */
      const productType = (await mysqlService.productTypeService.getOne({
        where: { typeName: productTypeName },
      })) as ProductType;

      if (!productType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid productTypeName';
        return results;
      }

      /** get menu type id */
      const menuType = (await mysqlService.menuTypeService.getOne({
        where: { typeName: menuTypeName },
      })) as MenuType;

      if (!menuType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid menuTypeName';
        return results;
      }

      /** create product */
      const product = (await mysqlService.productService.postOne(
        {
          productTypeId: productType.id,
          menuTypeId: menuType.id,
          name: name,
          price: price,
          unit: unit,
          amount: amount,
          description: description || null,
          image: image,
        },
        null,
      )) as Product;

      /** send responses to client-side */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = product;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  update 1 product
  */
  editProduct = async (
    productId: string | null | undefined,
    productTypeName: string | null | undefined,
    menuTypeName: string | null | undefined,
    name: string | null | undefined,
    price: number | null | undefined,
    unit: string | null | undefined,
    amount: number | null | undefined,
    description: string | null | undefined,
    image: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      /** check if mandatory inputs exist or not */
      if (!productId || !productTypeName || !menuTypeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      /** get product type id */
      const productType = (await mysqlService.productTypeService.getOne({
        where: { typeName: productTypeName },
      })) as ProductType;

      if (!productType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid productTypeName';
        return results;
      }

      /** get menu type id */
      const menuType = (await mysqlService.menuTypeService.getOne({
        where: { typeName: menuTypeName },
      })) as MenuType;

      if (!menuType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid menuTypeName';
        return results;
      }

      /** edit product */
      await mysqlService.productService.putOne(
        {
          id: productId,
          productTypeId: productType.id,
          menuTypeId: menuType.id,
          name: name || null,
          price: price || null,
          unit: unit || null,
          amount: amount || null,
          activeStatus: amount && amount > 0 ? true : false,
          description: description || null,
          image: image || undefined,
        },
        null,
      );

      /** send responses to client-side */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = moment(utc()).format('YYYY-MM-DD hh:mm:ss');
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  delete product list
  */
  deleteProductList = async (productIdList: string[] | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      // const productIdList: string[] | null = requestQuery.productIdList;
      if (!productIdList || (productIdList && productIdList.length === 0)) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      for (let x in productIdList) {
        if (productIdList[x]) {
          await mysqlService.productService.delete({
            where: { id: productIdList[x] },
          });
        }
      }

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = moment(utc()).format('YYYY-MM-DD hh:mm:ss');
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };
}

const productController = new ProductController();

export default productController;
