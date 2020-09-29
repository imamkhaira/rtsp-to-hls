import { Request, Response, NextFunction } from 'express';

const JSONResponse = (req: Request, res: Response, next: NextFunction) => {
    res.set('Content-Type', 'application/json');
    next();
}

export default JSONResponse;