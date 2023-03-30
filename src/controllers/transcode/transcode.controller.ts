/**
 * transcode.controller.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-06
 *
 * process http request from the transcode router
 */

import { type Request, type Response } from 'express'
import { createSubLogger } from '../../utils/logger'
// import { join } from 'path'
// import { TEMP_DIR } from '../config/config'

const log = createSubLogger('transcode.controller')

/* -------------------------------------------------------------------------- */

/** start transcode request */
export function startTranscsode (req: Request, res: Response): void {
  log.info('i am being used startTranscode')
}
