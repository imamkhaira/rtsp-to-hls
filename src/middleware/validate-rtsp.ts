import { NextFunction, Request, Response } from 'express';

/** make sure the user sends correct RTSP request  */
const validate_rtsp = (req: Request, res: Response, next: NextFunction) => {
    const rtsp = req.query[`url`] as string;
    const match = /rtsp:\/\/.*/.test(rtsp);
    if (match) next();
    else throw new Error(`Your query is invalid or contains invalid url!`);
};

export default validate_rtsp;
