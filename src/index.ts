import express, { Application } from 'express';
import Server from './server';

class App {
    public run(): void {
        const app: Application = express();
        const server: Server = new Server(app);

        server.start();
    }
}

const app: App = new App();

app.run();
