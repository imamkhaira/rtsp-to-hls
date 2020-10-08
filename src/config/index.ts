import dotenv from 'dotenv';
dotenv.config();

export const API_PORT = Number(process.env.API_PORT || 3000);
export const STREAM_MIN_PORT = Number(process.env.STREAM_MIN_PORT || 5000);
export const STREAM_MAX_PORT = Number(process.env.STREAM_MAX_PORT || 5500);
export const STREAM_KEEPALIVE_DURATION = Number(
    process.env.STREAM_KEEPALIVE_DURATION || 300000,
);
