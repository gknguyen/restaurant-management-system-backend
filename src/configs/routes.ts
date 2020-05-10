import { Router } from "express";
import menuTypeRouter from "../main/mysql-sequelize/m_menu_type/m_menu_type.routes";
import productTypeRouter from "../main/mysql-sequelize/m_product_type/m_product_type.routes";
import userTypeRouter from "../main/mysql-sequelize/m_user_type/m_user_type.routes";
import productRouter from "../main/mysql-sequelize/s_product/s_product.routes";
import userRouter from "../main/mysql-sequelize/s_user/s_user.routes";

const router = Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/menuType", menuTypeRouter);
router.use("/productType", productTypeRouter);
router.use("/userType", userTypeRouter);

export default router;
