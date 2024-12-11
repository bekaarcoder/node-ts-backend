import { Application } from 'express';
import 'dotenv/config';

class Server {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public startServer() {
        const port = parseInt(process.env.PORT!) || 5000;

        this.app.listen(port, () => {
            console.log(`App is running on port ${port}`);
        });
    }
}

export default Server;
