/**
 * stream.routes.ts
 * endpoint -> `/stream`
 *
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Mon 20 Feb 2023
 */

import express from 'express'
// import { createSubLogger } from '../utils/logger'
import { streamIndex, streamTest } from '../controllers/stream/stream.controller'

/* -------------------------------------------------------------------------- */
/*                        `stream` route initialization                       */
/* -------------------------------------------------------------------------- */

// const log = createSubLogger('stream.route')
const streamRoute = express.Router({ caseSensitive: true, strict: true })

/* -------------------------------------------------------------------------- */
/*                         `stream` route definitions                         */
/* -------------------------------------------------------------------------- */

// stream_route.use(express.static(TEMP_DIR));

streamRoute.get('/test', streamTest)

streamRoute.get('/:id/index.m3u8', streamIndex)

streamRoute.get('/:id/:segNo.ts', (req, res) => {
  console.log('eh anjeng')
  res.end('POST aaaaa')
})

export { streamRoute }
