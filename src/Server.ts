import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import PrintApiErrors from '@/middlewares/print-api-errors';
import JSONResHeader from '@/middlewares/json-res-header.ts';
import StreamDirectory from '@/middlewares/stream-dir.ts';

import { STREAM_DIRECTORY, STREAM_DIRECTORY_PUBLIC } from './config';
import BaseRouter from './modules';

// Init express
const server = express();

// Set basic Express settings
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(PrintApiErrors);
server.use(JSONResHeader);

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') server.use(morgan('dev'));

// Security
if (process.env.NODE_ENV === 'production') server.use(helmet());

// Add APIs
server.use(STREAM_DIRECTORY_PUBLIC, StreamDirectory(STREAM_DIRECTORY));
server.use('/api', BaseRouter);

// Export express instance
export default server;
