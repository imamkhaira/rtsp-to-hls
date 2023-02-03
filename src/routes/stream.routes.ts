/**
 * app.routes.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-03
 * --------------------------------------------------------------- *
 * in memory of Gisel, my cat who had suddenly died.
 * rest in peace, kitty. i know, i was not a good master.
 * I shall bear this loss of this death until the end of my life.
 * --------------------------------------------------------------- *
 *
 * this file define routes for the `/stream` endpoint.
 * this endpoint serves the static files (index.m3u8 and .ts segments)
 * of the correnspoinding video.
 *
 * endpoint -> `/stream`
 */

import express from 'express';
const stream_route = express.Router({ caseSensitive: true });

stream_route.get('/transcode', (req, res) => {
    res.end(`GET ssdd`);
});

stream_route.post('/transcode', (req, res) => {
    res.end(`POST aaaaa`);
});

export { stream_route };
