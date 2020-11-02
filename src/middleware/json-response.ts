import { Request, Response, NextFunction } from 'express';

/** sets the Content-Type header for every response */
const json_response = (req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('X-Content-Type-Options', 'nosniff');
    next();
};

export default json_response;
