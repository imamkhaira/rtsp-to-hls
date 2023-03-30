/**
 * controller.type.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Fri 17 Feb 2023
 *
 * contains type definition of contoller functions
 */

import type express from 'express'

/** a general controller function */
export type ControllerFunction<T = any> = (req: express.Request, res: express.Response) => T
