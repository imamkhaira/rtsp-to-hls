import { STREAM_DURATION } from '@/config';
import { Router } from 'express';
import PlaybackServices from './playback.service';
import HTTP from 'http-status-codes';

const route = Router();
const service = new PlaybackServices(STREAM_DURATION);

route.post('/start', async (req, res) => {
    const request_urls = req.body as string[];
    const response = await service.start(request_urls[0]);

    res.status(response.error ? HTTP.INTERNAL_SERVER_ERROR : HTTP.CREATED).send(
        response,
    );
});

route.post('/stop', async (req, res) => {
    const request_ids = req.body as string[];
    const response = await service.stop(request_ids[0]);

    res.status(response.error ? HTTP.INTERNAL_SERVER_ERROR : HTTP.OK).send(
        response,
    );
});

route.post('/heartbeat', (req, res) => {
    const request_ids = req.body as string[];
    const response = service.beat(request_ids[0]);

    res.status(response.error ? HTTP.INTERNAL_SERVER_ERROR : HTTP.OK).send(
        response,
    );
});

export default route;
