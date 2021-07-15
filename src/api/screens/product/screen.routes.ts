import express from 'express';
import productRouter from './product/product.routes';

const productScreenRouter = express.Router();

productScreenRouter.use('/products', productRouter);

export default productScreenRouter;
