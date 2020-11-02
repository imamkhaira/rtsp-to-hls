import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

// Setup command line options
const options = commandLineArgs([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'development',
        type: String
    }
]);

// Set the env file
const env = dotenv.config({ path: `./env/${options.env as string}.env` });

if (env.error) throw env.error;
