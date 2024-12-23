import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { userService } from '~/services/db/user.service';

class UserController {
    public async createUser(req: Request, res: Response) {
        const newUser = await userService.add(req.body);

        res.status(HTTP_STATUS.CREATED).json(newUser);
    }

    public async updateUser(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const updatedUser = await userService.update(
            id,
            req.body,
            req.currentUser
        );

        res.status(HTTP_STATUS.OK).json(updatedUser);
    }

    public async deleteUser(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await userService.remove(id, req.currentUser);

        res.status(HTTP_STATUS.OK).json({
            message: 'User deleted',
        });
    }

    public async getMe(req: Request, res: Response, next: NextFunction) {
        console.log(req.currentUser);
        res.status(200).json(req.currentUser);
    }
}

export const userController: UserController = new UserController();
