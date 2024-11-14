import express, { Request, Response } from 'express'
import { createUserController, findAllUsersController, findUserByIdController, loginController, removeUserController, updateUserController } from './user.controller';

export const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response) => {
    res.json('Hello World');
});

userRouter.route('/users')
    .get(findAllUsersController)
    .post(createUserController);

userRouter.post('/login', loginController);

userRouter.route('/users/:id')
    .get(findUserByIdController)
    .patch(updateUserController)
    .delete(removeUserController)
