/**
 * controller.type.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-06
 *
 * contains type definition of contoller functions
 */

import express from 'express';

/** a general controller function */
type ControllerFunction<T = any> = (req: express.Request, res: express.Response) => T;

export { ControllerFunction };
