import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { BadRequestException } from '~/globals/middleware/error.middleware';
import { prisma } from '~/prisma';

class UserController {
    public async createUser(req: Request, res: Response, next: NextFunction) {
        const { email, password, firstName, lastName, avatar } = req.body;

        const isEmailUnique = true;

        if (isEmailUnique) {
            return next(new BadRequestException('Email must be unique'));
        }

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
}

export const userController: UserController = new UserController();
