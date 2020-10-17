import STATUS_CODE from 'http-status';
import { Results } from '../../../../commons/constants/interfaces';
import { MenuType } from '../../../database/mysql/m.menu.type/m_menu_type.model';
import { ProductType } from '../../../database/mysql/m.product.type/m_product_type.model';
import { UserType } from '../../../database/mysql/m.user.type/m_user_type.model';
import mysqlService from '../../../database/mysql/mysqlServices';

class CommonAPIsController {
  /** ================================================================================== */
  /**
  get menu type list
  */
  getMenuTypeList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const menuTypeList = (await mysqlService.menuTypeService.getAll({
        attributes: ['id', 'typeName', 'icon'],
        order: [['createDateTime', 'ASC']],
      })) as MenuType[];

      if (menuTypeList && menuTypeList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = menuTypeList;
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
  get menu type by menu type name
  */
  getMenuType = async (typeName: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!typeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const menuType = (await mysqlService.menuTypeService.getOne({
        attributes: ['id', 'typeName', 'icon'],
        where: { typeName: typeName },
      })) as MenuType;

      if (menuType) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = menuType;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
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
  get menu type by menu type name
  */
  createMenuType = async (typeName: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!typeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const menuType = (await mysqlService.menuTypeService.postOne(
        {
          typeName: typeName,
        },
        null,
      )) as MenuType;

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = menuType;
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
  get product type list
  */
  getProductTypeList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const productTypeList = (await mysqlService.productTypeService.getAll({
        attributes: ['id', 'typeName'],
        order: [['createDateTime', 'ASC']],
      })) as ProductType[];

      if (productTypeList && productTypeList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = productTypeList;
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
  get product type by product type name
  */
  getProductType = async (typeName: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!typeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const productType = (await mysqlService.productTypeService.getOne({
        attributes: ['id', 'typeName'],
        where: { typeName: typeName },
      })) as ProductType;

      if (productType) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = productType;
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
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
  create 1 product type
  */
  createProductType = async (typeName: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: {},
    } as Results;

    try {
      if (!typeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const productType = (await mysqlService.productTypeService.postOne(
        {
          typeName: typeName,
        },
        null,
      )) as ProductType;

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = productType;
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
  get user type list
  */
  getUserTypeList = async () => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      const userTypeList = (await mysqlService.userTypeService.getAll({
        attributes: ['id', 'typeName'],
      })) as UserType[];

      if (userTypeList && userTypeList.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.values = userTypeList;
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
  create 1 user type
  */
  createUserType = async (typeName: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!typeName) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const userType = (await mysqlService.userTypeService.postOne(
        {
          typeName: typeName,
        },
        null,
      )) as UserType;

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = userType;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };
}

const commonAPIsController = new CommonAPIsController();

export default commonAPIsController;
