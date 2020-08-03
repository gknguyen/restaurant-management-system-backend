import { Router } from 'express';
import commonAPIsRouter from '../main/api/general/commonAPIs/commonAPIs.routes';
import productScreenRouter from '../main/api/screens/product/product.routes';
import userScreenRouter from '../main/api/screens/user/user.routes';

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
