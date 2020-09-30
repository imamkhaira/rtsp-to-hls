import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import RouteDocs from '@/types/routedocs';
import StreamDB from '@/entities/DB';
import Stream, { StreamRequest, StreamResponse } from '@/entities/Stream';

const route = Router();

const db = new StreamDB();

/** start the MPEG live stream */
route.post('/start', (req, res) => {
    const request = req.body as StreamRequest[];

    if (!request.length) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).end(`request length is ${request.length}`);
    }

    const response: StreamResponse[] = db.startStreams(request)
        .map(({ id, name, url, port, ends }) => ({
            id, name, url, port, ends
        }));
    return res.status(StatusCodes.CREATED).end(JSON.stringify(response));
});

/** stop the MPEG live stream and kill its websocket */
route.post('/stop', (req, res) => {
    const request = req.body as number[];

    if (!request.length)
        return res.status(StatusCodes.NOT_ACCEPTABLE).end(`request length is ${request.length}`);

    const response: StreamResponse[] = db.stopStreams(request)
        .map(({ id, name, url, port, ends }) => ({
            id, name, url, port, ends
        }));
    return res.status(StatusCodes.OK).end(JSON.stringify(response));
});

/** send ping to keep the stream alive */
route.post('/heartbeat', (req, res) => {
    const [ request, newEnd ] = [ req.body as number[], Date.now() + 5 * 60000 ];

    if (!request.length)
        return res.status(StatusCodes.NOT_ACCEPTABLE).end(`please see docs for example`);

    const response = request.map(port => ({
        port,
        ends: newEnd,
    }));
    return res.status(StatusCodes.OK).end(JSON.stringify(response));

});

route.all('/doc', (req, res) => {
    return res.end(JSON.stringify([
        {
            url: req.baseUrl + '/start',
            method: 'POST',
            body: {
                url: 'string',
                name: 'string'
            }
        },
        {
            url: req.baseUrl + '/stop/:streamPort',
            method: 'POST',
            body: [
                'port Numbers'
            ]
        },
        {
            url: req.baseUrl + '/heartbeat',
            method: 'POST',
            body: [
                'port Numbers'
            ]
        }
    ] as RouteDocs[]));
});

export default route;