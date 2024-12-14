import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { prisma } from '~/prisma';

class UserController {
    public async createUser(req: Request, res: Response, next: NextFunction) {
        const { email, password, firstName, lastName, avatar } = req.body;

        // Insert to DB
        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                firstName,
                lastName,
                avatar,
            },
        });

        res.status(HTTP_STATUS.CREATED).json(newUser);
    }

    public async getMe(req: Request, res: Response, next: NextFunction) {
        console.log(req.currentUser);
        res.status(200).json(req.currentUser);
    }
}

export const userController: UserController = new UserController();
