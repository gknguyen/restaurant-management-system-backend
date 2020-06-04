import { Router } from 'express';
import menuTypeRouter from '../main/mysql-sequelize/m_menu_type/m_menu_type.routes';
import productTypeRouter from '../main/mysql-sequelize/m_product_type/m_product_type.routes';
import userTypeRouter from '../main/mysql-sequelize/m_user_type/m_user_type.routes';
import productRouter from '../main/mysql-sequelize/s_product/s_product.routes';
import userRouter from '../main/mysql-sequelize/s_user/s_user.routes';

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/product', productRouter);
apiRouter.use('/menuType', menuTypeRouter);
apiRouter.use('/productType', productTypeRouter);
apiRouter.use('/userType', userTypeRouter);

export default apiRouter;
