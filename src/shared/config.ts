import dotenv from 'dotenv';

dotenv.config();

/** asbolute path where to put index.m3u8 and video segment files */
export const WORK_DIRECTORY = String(process.env.WORK_DIRECTORY);

/** the url path where the streams will be placed. */
export const OUTPUT_URL = String(process.env.OUTPUT_URL);

/** port to listen to */
export const PORT = Number(process.env.PORT);

/** maximum time in ms to keep the stream alive. */
export const STREAM_KEEPALIVE = Number(process.env.STREAM_KEEPALIVE);

export const RUNAS_UID = Number(process.env.RUNAS_UID);
