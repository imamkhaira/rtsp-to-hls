/**
 * config.ts
 * created by: the batmen <imamkhaira@gmail.com>
 * last updated on 2023-02-03
 *
 * contains the configuration constans that are used all over the app
 */

/** the port this app listens to */
export const PORT = 8081;

/**
 * where to put transcoded index and segments.
 * ideally this should be a high-IOPS device,
 * such as the ramdisk or `/dev/shm`.
 * make sure this directory is writable!!
 */
export const TEMP_DIR = '/dev';

/**
 * uuid of the user that this app will run as.
 * this user should have permission to write to `TEMP_DIR` above.
 */
export const RUNAS_UID = 1000;
