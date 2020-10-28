import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import BaseRouter from '@/modules';
import ServeHLS from '@/middlewares/serve-hls';
import JSONResponse from '@/middlewares/json-response';
import StructuredError from '@/middlewares/structured-error';
import { STREAM_DIRECTORY, STREAM_PUBLIC_PATH } from '@/config';

const app = express();

/* ----------------------------------------------------- */
/* -------------- Load Express Middleware -------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------------------------------------------- */
/* -- Log data in development, harden in production -- */

if (process.env.NODE_ENV === 'production') app.use(helmet());
else app.use(morgan('dev'));

/* ---------------------------------------------------- */
/* -------- Load Endpoints & custom middelware -------- */

app.use('/api', JSONResponse);
app.use(STREAM_PUBLIC_PATH, ServeHLS(STREAM_DIRECTORY, STREAM_PUBLIC_PATH));
app.use('/api', BaseRouter);
app.use(StructuredError);

// Export express instance
export default app;
