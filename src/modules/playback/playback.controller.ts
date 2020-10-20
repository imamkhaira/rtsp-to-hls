import { Router } from 'express';

const route = Router();

route.post('/start', (req, res) => {
    res.end('starting playback');
});

route.post('/stop', (req, res) => {
    res.end('stopping playback');
});

route.post('/heartbeat', (req, res) => {
    res.end('beating playback');
});

export default route;
