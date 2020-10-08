import { API_PORT } from '@/config';
import Server from '@/server';
import logger from './shared/Logger';

// Start the server
Server.listen(API_PORT, () => {
    logger.info(`Server is listening on port ${API_PORT}`);
});
