import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StreamRequest } from './stream.entity';
import StreamService from './stream.service';

const router = Router();

router.post('/start', (req, res) => {
    const request: StreamRequest[] = req.body;

    const newstreams = StreamService.createStreams(req.body);
    return res.status(StatusCodes.CREATED).end(JSON.stringify(newstreams));

});

router.post('/stop', (req, res) => {
    const request: number[] = req.body;

    const response = StreamService.stopStreams(req.body);
    return res.status(StatusCodes.OK).end(JSON.stringify(response));
});

router.post('/heartbeat', (req, res) => {
    const request: number[] = req.body;


    const response = StreamService.renewStream(request);
    return res.status(StatusCodes.OK).end(JSON.stringify(response));
});

export default router;
