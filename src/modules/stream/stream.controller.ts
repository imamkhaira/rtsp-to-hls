import { Router } from 'express';
import Stream, { StreamRequest } from './stream.entity';
import StreamService from './stream.service';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils';

const router = Router();

// const name = 'asus';
// const url = 'rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream';
// const port = 1234;

// let yonk: Stream;

router.post('/start', (req, res) => {
    const request: StreamRequest[] = req.body;
    if (!request.length) return res.status(StatusCodes.BAD_REQUEST).end(`request body must be an array`);

    const newstreams = StreamService.createStreams(req.body);
    return res.status(StatusCodes.CREATED).end(JSON.stringify(newstreams));
});

router.post('/stop', (req, res) => {
    const request: number[] = req.body;

    if (!request.length) return res.status(StatusCodes.BAD_REQUEST).end(`request body must be an array`);

    const response = StreamService.stopStreams(req.body);
    return res.status(StatusCodes.OK).end(JSON.stringify(response));
});

router.post('/heartbeat', (req, res) => {
    const request: number[] = req.body;

    if (!request.length) return res.status(StatusCodes.BAD_REQUEST).end(`request body must be an array`);

    const response = StreamService.renewStream(request);
    return res.status(StatusCodes.OK).end(JSON.stringify(response));
});


export default router;