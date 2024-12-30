import { prisma } from '~/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
    IAuthLogin,
    IAuthRegister,
} from '~/features/user/interface/auth.interface';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import crypto from 'crypto';
import { email } from '~/globals/helpers/Email';

class AuthService {
    public async addUser(requestBody: IAuthRegister) {
        const { email, password, firstName, lastName, avatar } = requestBody;

        const user = await this.getUserByEmail(email);
        if (user && !user.isActive) {
            throw new ForbiddenException('User is not active');
        }

        if (await this.isEmailAlreadyExists(email)) {
            throw new BadRequestException(`Email already exists`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert to DB
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                avatar,
            },
        });

        // Create JWT
        const payload = {
            id: newUser.id,
            email,
            firstName,
            lastName,
            avatar,
            role: newUser.role,
            isActive: newUser.isActive,
        };

        const accessToken: string = this.generateJWT(payload);

        return { accessToken, email: newUser.email };
    }

    public async login(requestBody: IAuthLogin) {
        const user = await this.getUserByEmail(requestBody.email);

        if (!user) {
            throw new BadRequestException('Invalid Credentials');
        }

        if (!user.isActive) {
            throw new ForbiddenException('User is not active');
        }

        const isPasswordMatched = await bcrypt.compare(
            requestBody.password,
            user.password
        );

        if (!isPasswordMatched) {
            throw new BadRequestException('Invalid Credentials');
        }

        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            role: user.role,
            isActive: user.isActive,
        };

        const accessToken: string = this.generateJWT(payload);
        return accessToken;
    }

    public async forgotPassword(userEmail: string) {
        const user = await this.getUserByEmail(userEmail);

        if (!user) {
            throw new NotFoundException(
                `User not found with this ${userEmail}`
            );
        }

        const passwordResetToken = crypto.randomBytes(20).toString('hex');
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                passwordResetCode: passwordResetToken,
                passwordResetExpireDate: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        const resetPasswordUrl = `http://localhost:5173/reset-password?token=${passwordResetToken}`;

        await email.send({
            from: 'admin@store.com',
            to: userEmail,
            subject: 'Reset Your Password',
            html: `
            Hi ${userEmail},
            <p>We have received the request to reset your password. Click the below link to reset your password.</p>
            <p>${resetPasswordUrl}</p>
            `,
        });
    }

    public async resetPassword(token: string, requestBody: any) {
        const { newPassword } = requestBody;

        if (!token || token === '') {
            throw new BadRequestException('Token is required');
        }

        const user = await prisma.user.findFirst({
            where: {
                passwordResetCode: token,
            },
        });

        if (!user) {
            throw new BadRequestException('Password reset token is invalid');
        }

        if (user.passwordResetExpireDate! < new Date(Date.now())) {
            throw new BadRequestException('Token is expired');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                passwordResetCode: null,
                passwordResetExpireDate: null,
            },
        });

        await email.send({
            from: 'admin@store.com',
            to: user.email,
            subject: 'Password Reset Successful',
            html: `
            Hi ${user.email},
            <p>Your password is changed successfully. Please login and check.</p>
            `,
        });
    }

    public async getUserByEmail(email: string) {
        return await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
    }

    private generateJWT(payload: any) {
        return jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
    }

    public async isEmailAlreadyExists(email: string) {
        const userEmail = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        return userEmail !== null;
    }
}

export const authService: AuthService = new AuthService();
