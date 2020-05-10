import express, { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import errorHandler from "../../../commons/error-handler";
import { Payload, Results } from "../../../commons/interfaces";
import { STATUS_CODE } from "../../../configs/config";
import { ProductType } from "./m_product_type.model";
import productTypeService from "./m_product_type.service";

const productTypeRouter = Router();

productTypeRouter.get("/getList", getList_API());
productTypeRouter.get("/getOne", getOne_API());
productTypeRouter.post("/createOne", createOne_API());

/* ================================================================================== */
/*
get product type list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: "",
    values: [],
  } as Results;

  try {
    const productTypeList = (await productTypeService.getAll({
      attributes: ["id", "typeName"],
      order: [["createDateTime", "ASC"]],
    })) as ProductType[];

    if (productTypeList && productTypeList.length > 0) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = "get productTypeList successfully";
      results.values = productTypeList;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "productTypeList not found";
      results.values = productTypeList;
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function getList_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const results = await getList();

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    }
  );
}

/* ================================================================================== */
/*
get product type by product type name
*/
export const getOne = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: "",
    values: {},
  } as Results;

  try {
    const typeName: string | null = requestQuery.typeName;

    if (!typeName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "some compulsory input data is missing";
      return results;
    }

    const productType = (await productTypeService.getOne({
      attributes: ["id", "typeName"],
      where: { typeName: typeName },
    })) as ProductType;

    if (productType) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = "get productType successfully";
      results.values = productType;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "productType not found";
      return results;
    }
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function getOne_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const requestQuery: any = req.query;
      const results = await getOne(requestQuery);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    }
  );
}

/* ================================================================================== */
/*
create 1 product type
*/
export const createOne = async (requestHeaders: any, requestBody: any) => {
  const results = {
    code: 0,
    message: "",
    values: {},
  } as Results;

  try {
    const token: any = requestHeaders.token;
    const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
    const loginUser: Payload | null = decodedToken ? decodedToken.payload : null;
    const createUserName: string | null = loginUser ? loginUser.username : null;

    const typeName: string | null = requestBody.typeName;

    if (!typeName || !createUserName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "some compulsory input data is missing";
      return results;
    }

    const productType = (await productTypeService.postOne(
      {
        typeName: typeName,
        createUserName: createUserName,
      },
      null
    )) as ProductType;

    results.code = STATUS_CODE.SUCCESS;
    results.message = "create productType successfully";
    results.values = productType;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function createOne_API() {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const requestHeaders: any = req.headers;
      const requestBody: any = req.body;
      const results = await createOne(requestHeaders, requestBody);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    }
  );
}

export default productTypeRouter;
