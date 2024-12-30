import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/globals/constants/http';
import { email } from '~/globals/helpers/Email';
import { authService } from '~/services/db/auth.service';

class AuthController {
    public async registerUser(req: Request, res: Response) {
        const { accessToken, email: userEmail } = await authService.addUser(
            req.body
        );
        await email.send({
            from: 'verification@ecomm.com',
            to: userEmail,
            subject: 'Welcome To The Store',
            html: `
            Hi ${userEmail},
            <p>Your account is created successfully.</p>
            <p>Happy shopping :)</p>
            `,
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: 'User registered successfully',
            accessToken,
            userEmail,
        });
    }

    public async loginUser(req: Request, res: Response) {
        const accessToken = await authService.login(req.body);

        res.status(HTTP_STATUS.OK).json({
            message: 'User logged in successfully',
            accessToken,
        });
    }

    public async forgotPassword(req: Request, res: Response) {
        const email = req.body.email;
        await authService.forgotPassword(email);

        res.status(HTTP_STATUS.OK).json({
            message: 'Email sent for password reset',
        });
    }

    public async resetPassword(req: Request, res: Response) {
        const token = req.query.token as string;
        await authService.resetPassword(token, req.body);

        res.status(HTTP_STATUS.OK).json({
            message: 'Password reset successful',
        });
    }
}

export const authController: AuthController = new AuthController();
