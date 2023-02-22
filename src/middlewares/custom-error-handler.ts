/**
 * custom-error-handler.ts
 * final error catcher in the request chain
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Mon 20 Feb 2023
 */

import { type NextFunction, type Response, type Request } from 'express'
import { createSubLogger } from '../utils/logger'

const log = createSubLogger('customErrorHandler')

/* -------------------------------------------------------------------------- */

/**
 * When an error occured, capture the http status, message and stack trace
 * then send it to client as JSON.
 * this is essentially the LAST middleware to load.
 * @example
 * {
 *  errorMessage: "image cannot be found",
 *  errorCode: 404,
 *  errorStack: <error stack trace>,
 * }
 * */
function customErrorHandler (err: any, _req: Request, res: Response, next: NextFunction): void {
  if (err === undefined) {
    next()
    return
  }

  const errorMessage = err.message ?? 'Uncatched error occured'
  const errorCode = err.code ?? '500'
  log.error(err)

  res.status(500).json({
    errorMessage,
    errorCode,
    errorStack: err
  })
}

export { customErrorHandler }
