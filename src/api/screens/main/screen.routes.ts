import express from 'express';
import productRouter from './product/product.routes';

const mainScreenRouter = express.Router();

mainScreenRouter.use('/products', productRouter);

export default mainScreenRouter;
