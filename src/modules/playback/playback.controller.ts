import { Router } from 'express';
import { STREAM_DURATION } from '@/shared/config';
import PlaybackServices from './playback.service';
import ValidateRTSP from '@/middlewares/valid-rtsp';

const route = Router();
const service = new PlaybackServices(STREAM_DURATION);

route.post('/start', ValidateRTSP, async (req, res) => {
    const request_urls = req.body as string[];
    const response = await service.start(request_urls[0]);

    res.end(response.to_json());
});

route.post('/stop', async (req, res) => {
    const request_ids = req.body as string[];
    const response = await service.stop(request_ids[0]);

    res.end(response.to_json());
});

route.post('/heartbeat', (req, res) => {
    const request_ids = req.body as string[];
    const response = service.beat(request_ids[0]);

    res.end(response.to_json());
});

route.post('/all', (req, res) => {
    const response = service.getRunning();

    res.end(response.to_json());
});

export default route;
