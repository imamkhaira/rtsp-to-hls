/**
 * test.controller.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Tue 21 Feb 2023
 *
 * process http request from the stream router
 */

import { resolve } from 'path'
import { readFileSync } from 'fs-extra'
import { type Request, type Response } from 'express'
import { BUILD_DATE, VERSION } from '../../config/config'

/* -------------------------------------------------------------------------- */

/** show the test message */
export function helpTest (_: Request, res: Response): void {
  res.status(200).json({
    message: 'Transcoder is reachable'
  })
}

/** show the software version and build number */
export function helpVersion (_: Request, res: Response): void {
  res.status(200).json({
    version: VERSION,
    buildDate: BUILD_DATE
  })
}

/** serve the help.txt file */
export function helpManual (_: Request, res: Response): void {
  const helpHeader = { 'Content-Type': 'text/plain' }
  const filePath = resolve(__dirname, 'help.txt')
  const helpText = readFileSync(filePath, 'utf-8')
  res.header(helpHeader).end(helpText)
}
