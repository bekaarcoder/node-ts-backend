import { Response } from 'express';

export function sendTokenToCookie(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, {
        maxAge: 1 * 60 * 60 * 1000, // 1hr
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
}
