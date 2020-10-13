import dotenv from 'dotenv';
dotenv.config();

export const API_PORT = Number(process.env.API_PORT || 3000);
export const API_PUBLIC_PATH = Number(process.env.API_PUBLIC_PATH || 3000);
// prettier-ignore
export const STREAM_DIRECTORY = String(process.env.STREAM_DIRECTORY) || '/dev/shm';
// prettier-ignore
export const STREAM_PUBLIC_PATH = String(process.env.STREAM_PUBLIC_PATH) || '/public';
export const STREAM_DURATION = Number(process.env.STREAM_DURATION || 300000);
