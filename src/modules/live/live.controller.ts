import { Router } from 'express';
import LiveServices from './live.service';
import { STREAM_DURATION } from '@/shared/config';
import ValidateRTSP from '@/middlewares/valid-rtsp';

const route = Router();
const service = new LiveServices(STREAM_DURATION);

route.post('/start', ValidateRTSP, async (req, res) => {
    const request_urls = req.body as string[];
    const response = await service.start(request_urls);

    res.end(response.to_json());
});

route.post('/stop', async (req, res) => {
    const request_ids = req.body as string[];
    const response = await service.stop(request_ids);

    res.end(response.to_json());
});

route.post('/heartbeat', (req, res) => {
    const request_ids = req.body as string[];
    const response = service.beat(request_ids);

    res.end(response.to_json());
});

route.post('/all', (req, res) => {
    const response = service.getRunning();

    res.end(response.to_json());
});

export default route;
