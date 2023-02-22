/**
 * config.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-03
 *
 * contains the configuration constans that are used all over the app
 */

/** date this software is being built */
export const BUILD_DATE = '2023-02-17'

/** software version */
export const VERSION = '1.2.3'

/** the port this app listens to */
export const PORT = 8081

/**
 * where to put transcoded index and segments.
 * ideally this should be a high-IOPS device,
 * such as the ramdisk or `/dev/shm`.
 * make sure this directory is writable!!
 */
export const TEMP_DIR = '/dev/shm'

/**
 * uuid of the user that this app will run as.
 * this user should have permission to write to `TEMP_DIR` above.
 */
export const RUNAS_UID = 1000

/** how long to keep the stream alive, by default (2 min). unless overridden */
export const DEFAULT_KEEPALIVE = 120 * 60 * 1000
