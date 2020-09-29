import { Router } from 'express';
import Transcoder from './Transcode';

const rootRouter = Router();

rootRouter.use('/transcode', Transcoder);

rootRouter.all('/', (req, res) => {
    res.end(JSON.stringify([
        {
            moduleUrl: '/transcode',
            moduleDocs: '/transcode/doc'
        },
    ]))
})
export default rootRouter;