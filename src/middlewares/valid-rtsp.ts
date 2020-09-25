import { NextFunction, Request, Response } from 'express';

/** make sure the user sends correct RTSP request  */
const ValidateRTSP = (req: Request, res: Response, next: NextFunction) => {
    const rtsps = req.body as string[];
    const found = rtsps.find((url) => !/rtsp:\/\/.*/.test(url));
    if (!found) next();
    else throw new Error(`You sent an invalid RTSP url!`);
};

export default ValidateRTSP;
