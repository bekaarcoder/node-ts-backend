import { Response } from 'express';

export function sendTokenToCookie(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, {
        maxAge: 1 * 60 * 60 * 1000, // 1hr
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
}

export function expireCookie(res: Response) {
    res.cookie('accessToken', '', {
        expires: new Date(0),
    });
}
