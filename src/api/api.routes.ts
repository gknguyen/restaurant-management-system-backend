import express from 'express';
import authRouter, { verifyToken } from './auth/auth.routes';
import commonRouter from './common/common.routes';
import imageRouter from './file/image.routes';
import mainScreenRouter from './screens/main/screen.routes';
import productScreenRouter from './screens/product/screen.routes';
import userScreenRouter from './screens/user/screen.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/image', imageRouter);

apiRouter.use('/common', verifyToken(), commonRouter);
apiRouter.use('/main-screen', verifyToken(), mainScreenRouter);
apiRouter.use('/product-screen', verifyToken(), productScreenRouter);
apiRouter.use('/user-screen', verifyToken(), userScreenRouter);

export default apiRouter;
