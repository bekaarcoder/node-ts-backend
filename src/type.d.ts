declare namespace Express {
    export interface Request {
        currentUser: IUserPayload;
    }
}

interface IUserPayload {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: string;
}
