/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import HTTP from 'http-status-codes';
import createResponse from '@/entities/response';
import logger from '@/shared/Logger';

/** send API errors to client in a fashionable way */
const StructuredError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!err) next();
    logger.err(err.message, true);
    res.status(HTTP.BAD_GATEWAY).end(
        createResponse(null, true, err.message).to_json(),
    );
};

export default StructuredError;
