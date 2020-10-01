import { Router } from 'express';
import StreamController from './stream/stream.controller';

const rootModule = Router();

rootModule.use('/transcode', StreamController);

rootModule.all('/', (req, res) => {
    res.end(JSON.stringify([
        {
            moduleUrl: '/transcode',
            moduleDocs: '/transcode/doc'
        },
    ]));
});
export default rootModule;