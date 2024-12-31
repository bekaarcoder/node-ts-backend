import { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnAuthorizedException } from './error.middleware';
import jwt from 'jsonwebtoken';
import { authService } from '~/services/db/auth.service';
import { userService } from '~/services/db/user.service';

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies['accessToken']) {
        throw new UnAuthorizedException('Token is invalid, please login again');
    }

    const token = req.cookies['accessToken'];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as IUserPayload;
        req.currentUser = decoded;
        next();
    } catch (error) {
        throw new UnAuthorizedException('Token is invalid, please login again');
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.getUserByEmail(req.currentUser.email);
        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Forbidden request');
        }
        next();
    } catch (error) {
        throw new ForbiddenException('Forbidden request');
    }
};

export const isShop = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.getUserByEmail(req.currentUser.email);
        if (!user || user.role !== 'SHOP') {
            throw new ForbiddenException('Forbidden request');
        }
        next();
    } catch (error) {
        throw new ForbiddenException('Forbidden request');
    }
};

export function authorizeRoles(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.currentUser.role)) {
            throw new ForbiddenException('Forbidden request');
        }

        next();
    };
}

export async function preventInactiveUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = await userService.getById(req.currentUser.id);

    if (!user.isActive) {
        throw new ForbiddenException('User is inactive');
    }

    next();
}
