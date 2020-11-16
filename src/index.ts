import './shared/load-env';
import config from '@/shared/config';
import logger from '@/shared/logger';

import app from '@/server';

// Start the server
const port = Number(config.api_port);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
