import { Router } from 'express';
import menuTypeRouter from '../database/m.menu.type/m_menu_type.routes';
import productTypeRouter from '../database/m.product.type/m_product_type.routes';
import userTypeRouter from '../database/m.user.type/m_user_type.routes';
import productRouter from '../database/s.product/s_product.routes';
import userRouter from '../database/s.user/s_user.routes';
import userScreenRouter from '../api/screens/user/user.routes';
import productScreenRouter from './screens/product/product.routes';
import commonAPIsRouter from './general/commonAPIs/commonAPIs.routes';

const apiRouter = Router();

// apiRouter.use('/user', userRouter);
// apiRouter.use('/product', productRouter);
// apiRouter.use('/menuType', menuTypeRouter);
// apiRouter.use('/productType', productTypeRouter);
// apiRouter.use('/userType', userTypeRouter);
apiRouter.use('/common', commonAPIsRouter);
apiRouter.use('/user', userScreenRouter);
apiRouter.use('/product', productScreenRouter);

export default apiRouter;
