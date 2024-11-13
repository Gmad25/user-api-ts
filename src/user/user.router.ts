import express, { Request, Response } from 'express'
import { BAD_REQUEST, StatusCodes } from 'http-status-codes';
import { createUser, findAllUsers, findUserByEmail, findUserById, findUserByUsername, removeUser, updateUser } from './user.database';
import { compare, hash } from 'bcrypt';

export const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response) => {
    res.json('Hello World');
});

userRouter.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await findAllUsers();
        res.json(users);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
});

userRouter.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await findUserById(id);

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
});

userRouter.post('/users', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!(username && email && password)) {
            const errorMissing = []
            if (!username) {
                errorMissing.push('Username is missing!');
            }
            if (!email) {
                errorMissing.push('Email is missing!')
            }
            if (!password) {
                errorMissing.push('password is missing!')
            }
            res.status(StatusCodes.BAD_REQUEST).json({ error: errorMissing });
            return;
        }

        const usernameIsTaken = await findUserByUsername(username);
        if (usernameIsTaken) {
            res.status(StatusCodes.BAD_REQUEST).json('Username is already taken');
            return;
        }

        const emailIsTaken = await findUserByEmail(email);
        if (emailIsTaken) {
            res.status(StatusCodes.BAD_REQUEST).json("Email is already taken");
            return;
        }

        const user = await createUser(req.body);
        res.json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
});

userRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            const errorMissing = [];
            if (!email) {
                errorMissing.push('Missing email');
            }
            if (!password) {
                errorMissing.push('Missing password!')
            }

            res.status(StatusCodes.BAD_REQUEST).json({ error: errorMissing });
            return
        }
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json('User not found!');
            return;
        }
        const isSamePassword = await compare(password, user.password);
        if (!isSamePassword) {
            res.status(StatusCodes.BAD_REQUEST).json('Wrong password!');
            return;
        }
        res.json(`Welcome back ${user.username}!`);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
});

userRouter.patch('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { email, password, username } = req.body;
        const user = await findUserById(id);
        if (!user) res.status(StatusCodes.NOT_FOUND).json('User not found');
        const updatedUser = await updateUser(id, { email, password, username });
        res.json(updatedUser)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
});

userRouter.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await findUserById(id);
        if (!user) res.status(StatusCodes.NOT_FOUND).json('User not found');
        removeUser(id);
        res.json('User has been removed successfully!');
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
});