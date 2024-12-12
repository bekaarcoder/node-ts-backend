import express, { Application, Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import appRoutes from './globals/routes/appRoutes';
import { HTTP_STATUS } from './globals/constants/http';
import { CustomError } from './globals/middleware/error.middleware';

class Server {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.setupMiddleware();
        this.setupRoutes();
        this.setupGlobalError();
        this.startServer();
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
    }

    private setupRoutes(): void {
        appRoutes(this.app);
    }

    private setupGlobalError(): void {
        // Not Found Error
        this.app.all('*', (req, res, next) => {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `URL ${req.originalUrl} not found`,
            });
        });

        // Global Error
        this.app.use(
            (error: any, req: Request, res: Response, next: NextFunction) => {
                if (error instanceof CustomError) {
                    res.status(error.statusCode).json(error.getErrorResponse());
                    return;
                }
                next();
            }
        );
    }

    private startServer() {
        const port = parseInt(process.env.PORT!) || 5000;

        this.app.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    }
}

export default Server;
