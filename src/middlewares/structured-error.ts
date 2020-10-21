import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ReturnResponse from '@/entities/response';
import logger from '@/shared/Logger';

export default (err: Error, req: Request, res: Response) => {
    logger.err(err.message);
    return res
        .status(StatusCodes.BAD_REQUEST)
        .end(new ReturnResponse(err, true, err.message).json);
};
