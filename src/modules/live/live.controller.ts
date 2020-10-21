import { Router } from 'express';
import HTTP from 'http-status-codes';
import { STREAM_DURATION } from '@/config';
import LiveServices from './live.service';

const route = Router();
const service = new LiveServices(STREAM_DURATION);

route.post('/start', async (req, res) => {
    const request_urls = req.body as string[];
    const response = await service.start(request_urls);

    res.status(response.error ? HTTP.INTERNAL_SERVER_ERROR : HTTP.CREATED).end(
        response.json,
    );
});

route.post('/stop', async (req, res) => {
    const request_ids = req.body as string[];
    const response = await service.stop(request_ids);

    res.status(response.error ? HTTP.INTERNAL_SERVER_ERROR : HTTP.OK).end(
        response.json,
    );
});

route.post('/heartbeat', (req, res) => {
    const request_ids = req.body as string[];
    const response = service.beat(request_ids);

    res.status(response.error ? HTTP.INTERNAL_SERVER_ERROR : HTTP.OK).end(
        response.json,
    );
});

export default route;
