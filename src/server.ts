import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

import BaseRouter from './routes';
import json_response from './middleware/json-response';
import structure_errors from './middleware/structured-error';

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(json_response);

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Security
else app.use(helmet());

// Add APIs
app.use('/api', BaseRouter);

// catch errors
app.use(structure_errors);

// Export express instance
export default app;
