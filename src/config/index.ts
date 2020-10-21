import dotenv from 'dotenv';
import cla from 'command-line-args';
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

export const API_PORT = Number(process.env.API_PORT || 3000);
export const API_PUBLIC_PATH = Number(process.env.API_PUBLIC_PATH || 3000);
// prettier-ignore
export const STREAM_DIRECTORY = String(process.env.STREAM_DIRECTORY) || '/dev/shm';
// prettier-ignore
export const STREAM_PUBLIC_PATH = String(process.env.STREAM_PUBLIC_PATH) || '/public';
export const STREAM_DURATION = Number(process.env.STREAM_DURATION || 300000);
