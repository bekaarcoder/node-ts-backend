import { prisma } from '~/prisma';
import bcrypt from 'bcrypt';
import { authService } from './auth.service';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '~/globals/middleware/error.middleware';
import { User } from '@prisma/client';
import {
    IUserChangePassword,
    IUserCreate,
    IUserUpdate,
} from '~/features/user/interface/user.interface';

class UserService {
    public async add(requestBody: IUserCreate) {
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

    public async addAvatar(
        file: Express.Multer.File | undefined,
        currentUser: IUserPayload
    ) {
        const user = await this.getById(currentUser.id);

        if (!file) {
            throw new BadRequestException('No file selected');
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                avatar: file.filename,
            },
        });
    }

    public async update(
        id: number,
        requestBody: IUserUpdate,
        user: IUserPayload
    ) {
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

    public async updatePassword(
        requestBody: IUserChangePassword,
        user: IUserPayload
    ) {
        const { currentPassword, newPassword } = requestBody;

        const currentUser = await this.getById(user.id);

        const isMatched = await bcrypt.compare(
            currentPassword,
            currentUser.password
        );

        if (!isMatched) {
            throw new BadRequestException('Current Password is incorrect');
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                password: newHashedPassword,
            },
        });
    }

    public async getById(id: number) {
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
            include: {
                cart: true,
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
