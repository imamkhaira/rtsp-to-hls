/**
 * transcode.controller.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-06
 *
 * process http request from the transcode router
 */

import { Request, Response } from 'express';
import { join } from 'path';
import { TEMP_DIR } from '../config/config';
import { createLogger } from '../utils/logger';

const log = createLogger('transcode.controller');

/* -------------------------------------------------------------------------- */

function startTranscode(req: Request, res: Response) {}
