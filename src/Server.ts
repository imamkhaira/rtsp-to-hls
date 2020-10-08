import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import PrintApiErrors from '@/middlewares/print-api-errors';
import JSONResHeader from '@/middlewares/json-res-header.ts';
import BaseRouter from './routes';

// Init express
const Server = express();

// Set basic Express settings
Server.use(express.json());
Server.use(express.urlencoded({ extended: true }));
Server.use(cookieParser());
Server.use(PrintApiErrors);
Server.use(JSONResHeader);

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') Server.use(morgan('dev'));

// Security
if (process.env.NODE_ENV === 'production') Server.use(helmet());

// Add APIs
Server.use('/api', BaseRouter);

// Export express instance
export default Server;
