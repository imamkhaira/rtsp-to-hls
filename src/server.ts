import express from 'express';
import { stream_route } from './routes/stream.routes';

const app = express();

app.use('/stream', stream_route);

function startServer(port: number) {
    app.listen(port, () => {
        console.log(`bapak kau listening on port ${port}`);
    });
}

export { startServer };
