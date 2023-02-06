/**
 * app.routes.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-06
 *
 * --------------------------------------------------------------- *
 * in memory of Gisell, my cat who had suddenly died.
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
// import { TEMP_DIR } from '../config/config';
import { createLogger } from '../utils/logger';
import { serveHtmlBanner } from '../controllers/stream.controller';

/* -------------------------------------------------------------------------- */
/*                        `stream` route initialization                       */
/* -------------------------------------------------------------------------- */

const log = createLogger('stream.route');
const stream_route = express.Router({ caseSensitive: true, strict: true });

/* -------------------------------------------------------------------------- */
/*                         `stream` route definitions                         */
/* -------------------------------------------------------------------------- */

// stream_route.use(express.static(TEMP_DIR));

stream_route.get('/:id/index.m3u8', (req, res) => {
    log.warn('bisa nih wak:}');
    // res.end(`pepec`);
});

stream_route.get('/', serveHtmlBanner);

stream_route.post('', (req, res) => {
    res.end(`POST aaaaa`);
});

export { stream_route };
