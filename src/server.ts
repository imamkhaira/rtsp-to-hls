/**
 * server.ts
 * create the main express instance, and s
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Tue 21 Feb 2023
 */

import express from 'express'
import { createSubLogger } from './utils/logger'
import { baseRouter } from './routes/app.routes.ts'
import { customErrorHandler } from './middlewares/custom-error-handler'

const app = express()
const log = createSubLogger('server')

log.info('loading routes')
app.use('/transcode', baseRouter)
// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//   res.end('hehehe')
// })
app.use(customErrorHandler)

function startServer (port: number): void {
  app.listen(port, () => log.info(`Server lisstening on port ${port}`))
}

export { startServer }
