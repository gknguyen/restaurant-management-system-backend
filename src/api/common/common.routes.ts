import express from 'express';
import menuTypeRouter from './menuType/menuType.routes';
import productTypeRouter from './productType/productType.routes';
import userTypeRouter from './userType/userType.routes';

const commonRouter = express.Router();

commonRouter.use('/user-types', userTypeRouter);
commonRouter.use('/product-types', productTypeRouter);
commonRouter.use('/menu-types', menuTypeRouter);

export default commonRouter;
