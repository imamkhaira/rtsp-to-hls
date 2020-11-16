/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import HTTP from 'http-status-codes';
import createResponse from '@/entities/APIResponse';
import logger from '@/shared/logger';

/** send API errors to client in a fashionable way */
const structure_errors = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (!error) next();
    else {
        logger.err(error.message, true);
        const response = createResponse(
            {
                query: req.query,
                param: req.params,
                headers: req.headers
            },
            HTTP.BAD_REQUEST,
            error.message
        );
        res.status(response.code).end(response.json);
    }
};

export default structure_errors;
