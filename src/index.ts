import dotenv from 'dotenv';
import cla from 'command-line-args';
import app from '@/server';
import logger from '@/shared/Logger';

// Setup command line options
const options = cla([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'development',
        type: String,
    },
]);

// Set the env file
const result2 = dotenv.config({
    path: `./.env/${options.env as string}.env`,
});

if (result2.error) throw result2.error;

// Start the server
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
