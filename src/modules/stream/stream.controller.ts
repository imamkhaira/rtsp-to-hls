import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import StreamProcessor from '@/processor/StreamProcessor';
import { StreamRequest, StreamResponse } from '@/entities/Stream';

const route = Router();

const db = new StreamProcessor();

/** start the MPEG live stream */
route.post('/start', (req, res) => {
    const request = req.body as StreamRequest[];

    if (!request.length) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).end(`request length is ${request.length}`);
    }

    const response: StreamResponse[] = db.startStreams(request)
        .map(streams => streams.streamResponse);
    return res.status(StatusCodes.CREATED).end(JSON.stringify(response));
});

/** stop the MPEG live stream and kill its websocket */
route.post('/stop', (req, res) => {
    const request = req.body as number[];

    if (!request.length)
        return res.status(StatusCodes.NOT_ACCEPTABLE).end(`request length is ${request.length}`);

    const response: StreamResponse[] = db.stopStreams(request)
        .map(streams => streams.toStreamResponse());
    return res.status(StatusCodes.OK).end(JSON.stringify(response));
});

/** send ping to keep the stream alive */
route.post('/heartbeat', (req, res) => {
    const [ request, newEnd ] = [ req.body as number[], Date.now() + 5 * 60000 ];

    if (!request.length)
        return res.status(StatusCodes.NOT_ACCEPTABLE).end(`please see docs for example`);

    const response: StreamResponse[] = db.updateHeartbeats(request).map(streams => streams.toStreamResponse());
    return res.status(StatusCodes.OK).end(JSON.stringify(response));

});

export default route;