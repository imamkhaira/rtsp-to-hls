import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '@/shared/Logger';

const PrintAPIErrors = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.error(err.message, err);
    return res.status(StatusCodes.BAD_REQUEST).end(
        JSON.stringify({
            error: err.message,
        }),
    );
};

export default PrintAPIErrors;
