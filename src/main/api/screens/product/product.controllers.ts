import STATUS_CODE from 'http-status';
import moment, { utc } from 'moment-timezone';
import { Op } from 'sequelize';
import { Results } from '../../../../commons/constants/interfaces';
import menuTypeModel, { MenuType } from '../../../database/m.menu.type/m_menu_type.model';
import menuTypeService from '../../../database/m.menu.type/m_menu_type.service';
import productTypeModel, {
  ProductType,
} from '../../../database/m.product.type/m_product_type.model';
import productTypeService from '../../../database/m.product.type/m_product_type.service';
import { Product } from '../../../database/s.product/s_product.model';
import productService from '../../../database/s.product/s_product.service';

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
      const productList = (await productService.getAll({
        attributes: ['id', 'name', 'price', 'unit', 'amount', 'activeStatus'],
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
      // const productId: string | null = requestQuery.productId;
      if (!productId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'productId is missing';
        return results;
      }

      const product = (await productService.getOne({
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
      // const searchValue: any | null = requestQuery.searchValue;
      const productList = (await productService.getAll({
        attributes: ['id', 'name', 'price', 'unit', 'amount', 'activeStatus'],
        where: {
          [Op.or]: [
            { name: { [Op.substring]: searchValue } },
            { price: { [Op.substring]: searchValue } },
            { unit: { [Op.substring]: searchValue } },
            { amount: { [Op.substring]: searchValue } },
            { activeStatus: { [Op.substring]: searchValue } },
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
      })) as Product[];

      if (productList && productList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = productList;
        return results;
      } else {
        const productList = (await productService.getAll({
          attributes: ['id', 'name', 'price', 'unit', 'amount', 'activeStatus'],
          include: [
            {
              model: productTypeModel,
              as: 'productType',
              attributes: ['typeName'],
              where: { typeName: { [Op.substring]: searchValue } },
            },
            {
              model: menuTypeModel,
              as: 'menuType',
              attributes: ['typeName'],
            },
          ],
        })) as Product[];

        if (productList && productList.length > 0) {
          results.code = STATUS_CODE.OK;
          results.message = 'successfully';
          results.values = productList;
          return results;
        } else {
          const productList = (await productService.getAll({
            attributes: ['id', 'name', 'price', 'unit', 'amount', 'activeStatus'],
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
                where: { typeName: { [Op.substring]: searchValue } },
              },
            ],
          })) as Product[];

          if (productList && productList.length > 0) {
            results.code = STATUS_CODE.OK;
            results.message = 'successfully';
            results.values = productList;
            return results;
          } else {
            const productList = (await productService.getAll({
              attributes: ['id', 'name', 'price', 'unit', 'amount', 'activeStatus'],
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
    createUserId: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      // /** get request input headers */
      // const token: any = requestHeaders.token;
      // const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
      // const loginUser: Payload = decodedToken.payload;
      // const createUserId: string = loginUser.id;

      // /** get request input body */
      // const productTypeName: string | null = requestBody.productTypeName;
      // const menuTypeName: string | null = requestBody.menuTypeName;
      // const name: string | null = requestBody.name;
      // const price: string | null = requestBody.price;
      // const unit: string | null = requestBody.unit;
      // const amount: number | null = requestBody.amount;
      // const description: Text | null = requestBody.description;
      // const image: string | null = requestBody.image;

      /** check if mandatory inputs exist or not */
      if (!productTypeName || !menuTypeName || !name || !price || !unit || !amount || !image) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      /** get product type id */
      const productType = (await productTypeService.getOne({
        where: { typeName: productTypeName },
      })) as ProductType;

      if (!productType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid productTypeName';
        return results;
      }

      /** get menu type id */
      const menuType = (await menuTypeService.getOne({
        where: { typeName: menuTypeName },
      })) as MenuType;

      if (!menuType) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid menuTypeName';
        return results;
      }

      /** create product */
      const product = (await productService.postOne(
        {
          productTypeId: productType.id,
          menuTypeId: menuType.id,
          name: name,
          price: price,
          unit: unit,
          amount: amount,
          description: description || null,
          image: image,
          createUserId: createUserId,
        },
        null,
      )) as Product;

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
    editUserId: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      // /** get request input headers */
      // const token: any = requestHeaders.token;
      // const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
      // const loginUser: Payload = decodedToken.payload;
      // const editUserId: string = loginUser.id;

      // /** get request input query */
      // const productId: string | null = requestQuery.productId;

      // /** get request input body */
      // const productTypeId: string | null = requestBody.productTypeId;
      // const menuTypeId: string | null = requestBody.menuTypeId;
      // const name: string | null = requestBody.name;
      // const price: string | null = requestBody.price;
      // const unit: string | null = requestBody.unit;
      // const amount: number | null = requestBody.amount;
      // const description: Text | null = requestBody.description;
      // const image: string | null = requestBody.image;

      /** check if mandatory inputs exist or not */
      if (!productId || !editUserId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      /** get product type id */
      if (productTypeName) {
        const productType = (await productTypeService.getOne({
          where: { typeName: productTypeName },
        })) as ProductType;

        if (!productType) {
          results.code = STATUS_CODE.PRECONDITION_FAILED;
          results.message = 'invalid productTypeName';
          return results;
        }

        productTypeName = productType.id;
      }

      /** get menu type id */
      if (menuTypeName) {
        const menuType = (await menuTypeService.getOne({
          where: { typeName: menuTypeName },
        })) as MenuType;

        if (!menuType) {
          results.code = STATUS_CODE.PRECONDITION_FAILED;
          results.message = 'invalid menuTypeName';
          return results;
        }

        menuTypeName = menuType.id;
      }

      await productService.putOne(
        {
          id: productId,
          productTypeId: productTypeName || null,
          menuTypeId: menuTypeName || null,
          name: name || null,
          price: price || null,
          unit: unit || null,
          amount: amount || null,
          activeStatus: amount && amount > 0 ? true : false,
          description: description || null,
          image: image || null,
          editUserId: editUserId,
        },
        null,
      );

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
          await productService.delete({
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