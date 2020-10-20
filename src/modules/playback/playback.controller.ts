import { Router } from 'express';

const route = Router();

route.post('/start', (req, res) => {
    res.end('playing back');
});

route.post('/stop', (req, res) => {
    res.end('stopping play');
});
