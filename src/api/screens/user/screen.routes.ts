import express from 'express';
import userRouter from './user/user.routes';

const userScreenRouter = express.Router();

userScreenRouter.use('/users', userRouter);

export default userScreenRouter;
