import {
    API_PORT,
    STREAM_DIRECTORY,
    STREAM_DURATION,
    STREAM_PUBLIC_PATH,
} from '@/shared/config';
import app from '@/server';
import logger from '@/shared/Logger';

// Setup command line options

// Start the server

console.log(STREAM_DIRECTORY, STREAM_PUBLIC_PATH, STREAM_DURATION);
app.listen(API_PORT, () => {
    logger.info('Transcoder server started on port: ' + API_PORT);
});
