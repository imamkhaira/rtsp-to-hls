/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import HTTP from 'http-status-codes';
import createResponse from '@/entities/response';
import logger from '@/shared/Logger';

/** send API errors to client in a fashionable way */
export default (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.err(err, true);
    return res
        .status(HTTP.BAD_REQUEST)
        .end(createResponse(null, true, err.name, err.message));
};
