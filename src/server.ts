import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
// import 'dotenv/config';
import dotenv from 'dotenv';
import appRoutes from './globals/routes/appRoutes';
import { HTTP_STATUS } from './globals/constants/http';
import {
    CustomError,
    InternalServerException,
    NotFoundException,
} from './globals/middleware/error.middleware';

class Server {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.setEnvVariables();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupGlobalError();
        this.startServer();
    }

    private setEnvVariables() {
        const envFile =
            process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
        dotenv.config({ path: envFile });
        console.log(envFile);
        console.log(process.env.PORT);
    }

    private setupMiddleware(): void {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use('/images', express.static('images'));
    }

    private setupRoutes(): void {
        appRoutes(this.app);
    }

    private setupGlobalError(): void {
        // Not Found Error
        this.app.all('*', (req, res, next) => {
            return next(
                new NotFoundException(`Url ${req.originalUrl} not found`)
            );
        });

        // Global Error
        this.app.use(
            (error: any, req: Request, res: Response, next: NextFunction) => {
                if (error instanceof CustomError) {
                    res.status(error.statusCode).json(error.getErrorResponse());
                    return;
                } else {
                    console.log(error);
                    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        message: 'Something went wrong',
                        error: error.message,
                    });
                }
                next();
            }
        );
    }

    private startServer() {
        const port = parseInt(process.env.PORT!) || 5050;

        this.app.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    }
}

export default Server;
