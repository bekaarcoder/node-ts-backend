import { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnAuthorizedException } from './error.middleware';
import jwt from 'jsonwebtoken';
import { authService } from '~/services/db/auth.service';

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    if (
        !req.headers['authorization'] ||
        !req.headers['authorization'].startsWith('Bearer')
    ) {
        throw new UnAuthorizedException('Token is invalid, please login again');
    }

    const token = req.headers['authorization'].split(' ')[1];
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
