export interface IUserChangePassword {
    currentPassword: string;
    newPassword: string;
}

export interface IUserCreate {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface IUserUpdate {
    firstName: string;
    lastName: string;
    avatar: string;
}
