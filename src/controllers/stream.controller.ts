/**
 * stream.controller.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-06
 *
 * process http request from the stream router
 */

import { Request, Response } from 'express';
import { join } from 'path';
import { TEMP_DIR } from '../config/config';
import { createLogger } from '../utils/logger';

const log = createLogger('stream.controller');

/* -------------------------------------------------------------------------- */

/**
 * serve the HTML message that this endpoint is now reachable.
 * listens at `/`
 */
function serveHtmlBanner(req: Request, res: Response) {
    log.info(`bapak ko`);
    res.setHeader('Content-Type', 'text/html');
    return res.end(`
      <html>
        <h1>stream endpoint is reachable</h1>
      </html>
  `);
}

/**
 * serves the index.m3u8 file to the HLS player.
 * listens at `/stream/:streamId/index.m3u8`
 */
function serveIndex(req: Request, res: Response) {
    const streamId = req.params['id'] as string | undefined;
    if (!streamId) throw `stream id not provided`;
    const filePath = join(TEMP_DIR, streamId, 'index.m3u8');
    return res.download(filePath);
}

/* -------------------------------------------------------------------------- */

export { serveHtmlBanner, serveIndex };
