import express from 'express';
import { stream_route } from './routes/stream.routes';
import { createLogger } from './utils/logger';

const app = express();
const log = createLogger('server');

log.info('loading routes');
app.use('/stream', stream_route);

function startServer(port: number) {
    log.info('starting server');
    app.listen(port, () => void log.info(`Server listening on port ${port}`));
}

export { startServer };
