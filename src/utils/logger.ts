/**
 * logger.ts
 * configures Winston logger library to log using timestamped JSON
 * co console and file.
 *
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on Mon 21 Feb 2023
 *
 */

import {
  createLogger,
  config,
  format,
  transports,
  type Logger
} from 'winston'

/* -------------------------------------------------------------------------- */

/** write log to the console */
const consoleOutput = new (transports.Console)()

/** write log to a log file, rotated regularly */
// const fileOutput = new (transports.DailyRotateFile)({
//   filename: cfg.appLogName,
//   dirname: __dirname + '/../' + cfg.logsDirectory,
//   datePattern: cfg.rollingDatePattern,
//   timestamp: timeFormatFn
// })

/** create a custom log format in JSON */
const customJSONLog = format.combine(
  format.errors({ stack: true }),
  format.timestamp(),
  format.json(),
  format.prettyPrint()
)

/** write log to the default log driver. */
const appLogger = createLogger({
  levels: config.npm.levels,
  format: customJSONLog,
  transports: [consoleOutput]
})

/** creates a logger with the given `scope`. */
function createSubLogger (scope: string): Logger {
  return appLogger.child({ scope })
}

export { appLogger, createSubLogger }
