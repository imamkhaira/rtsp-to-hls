/* eslint-disable no-console */
import { API_PORT, STREAM_DIRECTORY, STREAM_DURATION, STREAM_PUBLIC_PATH } from '@/shared/config';
import app from '@/server';
import logger from './shared/Logger';

app.listen(API_PORT, () => {
    logger.info(`
    listen port: ${API_PORT}
    output dir: ${STREAM_DIRECTORY}
    hls public path: ${STREAM_PUBLIC_PATH}
    stream duration: ${STREAM_DURATION}
    `);
});
