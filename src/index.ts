import '@/shared/load-env'; // Must be the first import
import app from './server';
import logger from '@/shared/logger';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
