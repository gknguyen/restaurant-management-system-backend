import express, { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import { Op } from "sequelize";
import errorHandler from "../../../commons/error-handler";
import { Payload, Results } from "../../../commons/interfaces";
import { STATUS_CODE } from "../../../configs/config";
import { client, redisConnected } from "../../../configs/redis";
import { cache } from "../../cache.redis/cache.redis.routes";
import menuTypeModel from "../m_menu_type/m_menu_type.model";
import productTypeModel from "../m_product_type/m_product_type.model";
import { Product } from "./s_product.model";
import productService from "./s_product.service";

const productRouter = Router();

productRouter.get("/getList", cache("productList"), getList_API());
productRouter.get("/getOne", getOne_API());
productRouter.get("/searchList", searchList_API());
productRouter.post("/createOne", createOne_API());
productRouter.put("/updateOne", updateOne_API());
productRouter.delete("/deleteList", deleteList_API());

/* ================================================================================== */
/*
get product list
*/
export const getList = async () => {
  const results = {
    code: 0,
    message: "",
    values: [],
  } as Results;

  try {
    const productList = (await productService.getAll({
      attributes: ["id", "name", "price", "unit", "amount", "activeStatus"],
      include: [
        {
          model: productTypeModel,
          as: "productType",
          attributes: ["typeName"],
        },
        {
          model: menuTypeModel,
          as: "menuType",
          attributes: ["typeName"],
        },
      ],
    })) as Product[];

    if (productList && productList.length > 0) {
      if (redisConnected) {
        const redisKey = "productList";
        const productListString = JSON.stringify(productList);
        client.setex(redisKey, 3600, productListString);
      }

      results.code = STATUS_CODE.SUCCESS;
      results.message = "get productList successfully";
      results.values = productList;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "productList not found";
      results.values = productList;
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
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
get 1 product by id
*/
export const getOne = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: "",
    values: {},
  } as Results;

  try {
    const productId: string | null = requestQuery.productId;

    if (!productId) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "some compulsory input data is missing";
      return results;
    }

    const product = (await productService.getOne({
      attributes: [
        "id",
        "name",
        "price",
        "unit",
        "amount",
        "activeStatus",
        "image",
        "description",
      ],
      where: { id: productId },
      include: [
        {
          model: productTypeModel,
          as: "productType",
          attributes: ["id", "typeName"],
        },
        {
          model: menuTypeModel,
          as: "menuType",
          attributes: ["id", "typeName"],
        },
      ],
    })) as Product;

    if (product) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = "get product successfully";
      results.values = product;
      return results;
    } else {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "product not found";
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
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
search product list
*/
export const searchList = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: "",
    values: {},
  } as Results;

  try {
    const searchValue: any | null = requestQuery.searchValue;

    const productSearchcondition = {
      [Op.or]: [
        { name: { [Op.substring]: searchValue } },
        { price: { [Op.substring]: searchValue } },
        { unit: { [Op.substring]: searchValue } },
        { amount: { [Op.substring]: searchValue } },
        { activeStatus: { [Op.substring]: searchValue } },
      ],
    };

    const productList = (await productService.getAll({
      attributes: ["id", "name", "price", "unit", "amount", "activeStatus"],
      where: productSearchcondition,
      include: [
        {
          model: productTypeModel,
          as: "productType",
          attributes: ["typeName"],
        },
        {
          model: menuTypeModel,
          as: "menuType",
          attributes: ["typeName"],
        },
      ],
    })) as Product[];

    if (productList && productList.length > 0) {
      results.code = STATUS_CODE.SUCCESS;
      results.message = "search productList successfully";
      results.values = productList;
      return results;
    } else {
      const productTypeSearchCondition = {
        typeName: { [Op.substring]: searchValue },
      };

      const productList = (await productService.getAll({
        attributes: ["id", "name", "price", "unit", "amount", "activeStatus"],
        include: [
          {
            model: productTypeModel,
            as: "productType",
            attributes: ["typeName"],
            where: productTypeSearchCondition,
          },
          {
            model: menuTypeModel,
            as: "menuType",
            attributes: ["typeName"],
          },
        ],
      })) as Product[];

      if (productList && productList.length > 0) {
        results.code = STATUS_CODE.SUCCESS;
        results.message = "search productList successfully";
        results.values = productList;
        return results;
      } else {
        const menuTypeSearchCondition = {
          typeName: { [Op.substring]: searchValue },
        };

        const productList = (await productService.getAll({
          attributes: ["id", "name", "price", "unit", "amount", "activeStatus"],
          include: [
            {
              model: productTypeModel,
              as: "productType",
              attributes: ["typeName"],
            },
            {
              model: menuTypeModel,
              as: "menuType",
              attributes: ["typeName"],
              where: menuTypeSearchCondition,
            },
          ],
        })) as Product[];

        if (productList && productList.length > 0) {
          results.code = STATUS_CODE.SUCCESS;
          results.message = "search productList successfully";
          results.values = productList;
          return results;
        } else {
          const productList = (await productService.getAll({
            attributes: ["id", "name", "price", "unit", "amount", "activeStatus"],
            include: [
              {
                model: productTypeModel,
                as: "productType",
                attributes: ["typeName"],
              },
              {
                model: menuTypeModel,
                as: "menuType",
                attributes: ["typeName"],
              },
            ],
          })) as Product[];

          if (productList && productList.length > 0) {
            results.code = STATUS_CODE.SUCCESS;
            results.message = "search productList successfully";
            results.values = productList;
            return results;
          } else {
            results.code = STATUS_CODE.NOT_FOUND;
            results.message = "search productList failed";
            results.values = productList;
            return results;
          }
        }
      }
    }
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function searchList_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestQuery: any = req.query;
      const results = await searchList(requestQuery);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    }
  );
}

/* ================================================================================== */
/*
create 1 product
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

    const productTypeId: string | null = requestBody.productTypeId;
    const menuTypeId: string | null = requestBody.menuTypeId;
    const name: string | null = requestBody.name;
    const price: string | null = requestBody.price;
    const unit: string | null = requestBody.unit;
    const amount: number | null = requestBody.amount;
    const description: Text | null = requestBody.description;
    const image: string | null = requestBody.image;

    if (
      !productTypeId ||
      !menuTypeId ||
      !name ||
      !price ||
      !unit ||
      !amount ||
      !image ||
      !createUserName
    ) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "some compulsory input data is missing";
      return results;
    }

    const product = (await productService.postOne(
      {
        productTypeId: productTypeId,
        menuTypeId: menuTypeId,
        name: name,
        price: price,
        unit: unit,
        description: description,
        amount: amount,
        image: image,
        createUserName: createUserName,
      },
      null
    )) as Product;

    if (redisConnected) {
      const redisKey = "productList";
      client.del(redisKey);
    }

    results.code = STATUS_CODE.SUCCESS;
    results.message = "create product successfully";
    results.values = product;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function createOne_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

/* ================================================================================== */
/*
update 1 product
*/
export const updateOne = async (
  requestHeaders: any,
  requestQuery: any,
  requestBody: any
) => {
  const results = {
    code: 0,
    message: "",
    values: {},
  } as Results;

  try {
    const token: any = requestHeaders.token;
    const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
    const loginUser: Payload | null = decodedToken ? decodedToken.payload : null;
    const updateUserName: string | null = loginUser ? loginUser.username : null;

    const productId: string | null = requestQuery.productId;

    const productTypeId: string | null = requestBody.productTypeId;
    const menuTypeId: string | null = requestBody.menuTypeId;
    const name: string | null = requestBody.name;
    const price: string | null = requestBody.price;
    const unit: string | null = requestBody.unit;
    const amount: number | null = requestBody.amount;
    const description: Text | null = requestBody.description;
    const image: string | null = requestBody.image;

    if (!productId || !updateUserName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "some compulsory input data is missing";
      return results;
    }

    const informations: any = {
      id: productId,
      updateUserName: updateUserName,
    };
    if (productTypeId) {
      informations.productTypeId = productTypeId;
    }
    if (menuTypeId) {
      informations.menuTypeId = menuTypeId;
    }
    if (name) {
      informations.name = name;
    }
    if (price) {
      informations.price = price;
    }
    if (unit) {
      informations.unit = unit;
    }
    if (amount) {
      informations.amount = amount;
      if (amount > 0) {
        informations.activeStatus = true;
      } else {
        informations.activeStatus = false;
      }
    }
    if (description) {
      informations.description = description;
    }
    if (image) {
      informations.image = image;
    }

    const successFlag = (await productService.putOne(informations, null)) as boolean;

    results.code = STATUS_CODE.SUCCESS;
    results.message = "update product successfully";
    results.values = successFlag === false ? "updated" : "inserted";
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function updateOne_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestHeaders: any = req.headers;
      const requestQuery: any = req.query;
      const requestBody: any = req.body;
      const results = await updateOne(requestHeaders, requestQuery, requestBody);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    }
  );
}

/* ================================================================================== */
/*
delete product list
*/
export const deleteList = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: "",
    values: {},
  } as Results;

  try {
    const productIdList: string[] | null = requestQuery.productIdList;

    if (!productIdList || (productIdList && productIdList.length === 0)) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = "some compulsory input data is missing";
      return results;
    }

    let totalSuccessNum: number = 0;
    for (let i = 0; i < productIdList.length; i++) {
      if (productIdList[i]) {
        let productId: string = productIdList[i];

        const successNum = (await productService.delete({
          where: { id: productId },
        })) as number;

        totalSuccessNum = totalSuccessNum + successNum;
      }
    }

    results.code = STATUS_CODE.SUCCESS;
    results.message = "delete product list successfully";
    results.values = totalSuccessNum;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = err.toString();
    return results;
  }
};

function deleteList_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestQuery: any = req.query;
      const results = await deleteList(requestQuery);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    }
  );
}

export default productRouter;
