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
} from '~/globals/middleware/error.middleware';

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

        return accessToken;
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
