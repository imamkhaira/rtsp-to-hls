import { Router } from 'express';

const route = Router();

route.post('/start', (req, res) => {
    res.end('starting livestream');
});

route.post('/stop', (req, res) => {
    res.end('stopping livestream');
});

route.post('/heartbeat', (req, res) => {
    res.end('beating livestream');
});

export default route;
