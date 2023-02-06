/**
 * logger.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-06
 *
 * configures Winston logger library to log using timestamped JSON
 * co console and file.
 */

import { createLogger as createWinstonLogger, config, format, transports } from 'winston';

/** write log to the console */
const console_driver = new transports.Console();

/** write log to the default log driver. */
const winston = createWinstonLogger({
    levels: config.npm.levels,
    format: format.combine(format.timestamp(), format.json()),
    transports: [console_driver]
});

/** creates a logger with the given `scope`. */
function createLogger(scope: string) {
    return winston.child({ scope });
}

export { createLogger };
