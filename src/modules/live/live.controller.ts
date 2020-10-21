import { Router } from 'express';
import HTTP from 'http-status-codes';
import { STREAM_DURATION } from '@/config';
import LiveServices from './live.service';

const route = Router();
const service = new LiveServices(STREAM_DURATION);

route.post('/start', async (req, res) => {
    const request_urls = req.body as string[];
    const response = await service.start(request_urls);

    res.status(HTTP.OK).end(response);
});

route.post('/stop', async (req, res) => {
    const request_ids = req.body as string[];
    const response = await service.stop(request_ids);

    res.status(HTTP.OK).end(response);
});

route.post('/heartbeat', (req, res) => {
    const request_ids = req.body as string[];
    const response = service.beat(request_ids);

    res.status(HTTP.OK).end(response);
});

route.post('/all', (req, res) => {
    const response = service.getRunning();

    res.status(HTTP.OK).end(response);
});

export default route;
