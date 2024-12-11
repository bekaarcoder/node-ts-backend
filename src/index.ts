import express, { Application } from 'express';
import Server from './server';

class App {
    public run(): void {
        const app: Application = express();
        const server: Server = new Server(app);

        server.startServer();
    }
}

const app: App = new App();

app.run();
