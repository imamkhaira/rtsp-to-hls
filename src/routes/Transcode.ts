import { Router } from 'express';
import RouteDocs from '@/types/routedocs'

const route = Router();

/** start the MPEG live stream */
route.post('/start', (req, res) => {
    res.status(201).end(JSON.stringify({
        port: Math.floor((Math.random() * 1000) + 4000),
        originalRequest: req.body
    }));
});

/** stop the MPEG live stream and kill its websocket */
route.post('/stop/:streamPort', (req, res) => {
    const streamPort = req.params[`streamPort`];
    res.end(`wkwkwkkwkw deleted ${streamPort}`);
});

/** send ping to keep the stream alive */
route.post('/heartbeat', (req, res) => {
    const streamPort = req.body as number[];
    const newEnd = Date.now() + 5 * 60000;
    const response = streamPort.map(port => ({
        port,
        ending: newEnd
    }));
    res.status(202).end(JSON.stringify(response));
});

route.all('/doc', (req, res) => {
    res.end(JSON.stringify([
        {
            url: req.baseUrl + '/start',
            method: 'POST',
            param: [],
            body: {
                url: 'string',
                name: 'string'
            }
        },
        {
            url: req.baseUrl + '/stop/:streamPort',
            method: 'POST',
            param: [
                {
                    name: 'streamPort',
                    description: 'the websocket port that will be ended'
                }
            ]
        },
        {
            url: req.baseUrl + '/heartbeat',
            method: 'POST',
            param: null,
            body: [
                'portNumbers'
            ]
        }
    ] as RouteDocs[]));
})

export default route;