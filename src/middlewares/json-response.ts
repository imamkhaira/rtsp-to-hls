import { Request, Response, NextFunction } from 'express';

/** sets the Content-Type header for every response */
const JSONResponse = (req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Type', 'application/json');
    next();
};

export default JSONResponse;