/**
 * stream.controller.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Fri 17 Feb 2023
 *
 * process http request from the stream router
 */

import { type Request, type Response } from 'express'
import { join } from 'path'
import { TEMP_DIR } from '../../config/config'
// import { createSubLogger } from '../../utils/logger'

// const log = createSubLogger('stream.controller')

/* -------------------------------------------------------------------------- */

/**
 * serve the HTML message that this endpoint is now reachable.
 * listens at `/`
 */
export function streamTest (req: Request, res: Response): void {
  res.status(200).json({
    message: 'stream is reachable!'
  })
}

/**
 * serves the index.m3u8 file to the HLS player.
 * listens at `/stream/:streamId/index.m3u8`
 */
export function streamIndex (req: Request, res: Response): void {
  const streamId = req.params.id as string | undefined
  if (streamId === undefined) throw new Error('stream id not provided')
  const filePath = join(TEMP_DIR, streamId, 'index.m3u8')
  res.download(filePath)
}

/* -------------------------------------------------------------------------- */
