import { prisma } from '~/prisma';
import bcrypt from 'bcrypt';
import { authService } from './auth.service';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { User } from '@prisma/client';

class UserService {
    public async add(requestBody: any) {
        const { email, password, firstName, lastName, avatar } = requestBody;

        if (await authService.isEmailAlreadyExists(email)) {
            throw new BadRequestException(`User already exist with this email`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                avatar,
            },
        });

        return this.returnUser(newUser);
    }

    public async update(id: number, requestBody: any, user: IUserPayload) {
        const { firstName, lastName, avatar } = requestBody;

        const existingUser = await this.getById(id);
        if (existingUser.id !== user.id) {
            throw new ForbiddenException('Forbidden request');
        }

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                firstName,
                lastName,
                avatar,
            },
        });

        return this.returnUser(updatedUser);
    }

    public async remove(id: number, user: IUserPayload) {
        const existingUser = await this.getById(id);
        if (existingUser.id !== user.id) {
            throw new ForbiddenException('Forbidden request');
        }

        await prisma.user.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }

    public async getById(id: number) {
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
        });

        if (!user) {
            throw new NotFoundException(`User not found with id ${id}`);
        }

        return user;
    }

    private returnUser(user: User) {
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar,
        };
    }
}

export const userService: UserService = new UserService();
