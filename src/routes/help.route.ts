/**
* help.routes.ts
* endpoint -> `/help`

* created by: the batmen <imamkhaira@gmail.com>
* last updated on Mon 20 Feb 2023
*/

import { Router } from 'express'
import { helpManual, helpTest, helpVersion } from '../controllers/help/help.controller'
// import { TEMP_DIR } from '../config/config';
// import { createSubLogger } from '../utils/logger'
// import { serveHtmlBanner } from '../controllers/stream.controller'

const testRoute = Router()

testRoute.get('/test', helpTest)

testRoute.get('/version', helpVersion)

testRoute.get('/manual', helpManual)

export { testRoute }
