import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const route = Router();

route.post('/start', (req, res) => {
    res.status(StatusCodes.OK).send('pantek created');
});

route.post('/stop', (req, res) => {
    res.status(StatusCodes.OK).send('pantek hancur');
});

route.post('/heartbeat', (req, res) => {
    res.status(StatusCodes.OK).send('pantek heartbeat');
});

export default route;
