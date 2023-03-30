/**
 * app.routes.ts
 * defines the main app route
 *
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Mon 20 Feb 2023
 */

import { Router } from 'express'
import { testRoute } from './help.route'
import { streamRoute } from './stream.routes'
// import { transcodeRoute } from './transcode.route'

/** the top-most router. this will breakdown into many smaller routes */
const baseRouter = Router()

baseRouter.use('/help', testRoute)
baseRouter.use('/stream', streamRoute)
// baseRouter.use('/transcode', transcodeRoute)
// baseRouter.use('/test', testRoute)

export { baseRouter }
