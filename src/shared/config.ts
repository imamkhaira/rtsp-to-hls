import dotenv from 'dotenv';
const environment = process.env.NODE_ENV || 'development';

// Set the env file
const result2 = dotenv.config({
    path: `./.env/${environment}.env`,
});

if (result2.error) throw result2.error;

export const SERVER_ADDRESS =
    process.env.SERVER_ADDRESS || 'http://192.168.100.198:3000';
export const API_PORT = Number(process.env.API_PORT || 3000);
export const API_PUBLIC_PATH = Number(process.env.API_PUBLIC_PATH || 3000);
export const STREAM_DIRECTORY =
    String(process.env.STREAM_DIRECTORY) || '/dev/shm';
export const STREAM_PUBLIC_PATH =
    String(process.env.STREAM_PUBLIC_PATH) || '/public';
export const STREAM_DURATION = Number(process.env.STREAM_DURATION || 300000);
