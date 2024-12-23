declare namespace Express {
    export interface Request {
        currentUser: IUserPayload;
    }
}

interface IUserPayload {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: string;
    isActive: boolean;
}
