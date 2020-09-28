import { STREAM_MIN_PORT, STREAM_MAX_PORT } from '@/config'
import { logger } from '@/utils';

export interface StreamObject {
    port: number;
    name: string;
    source: string;
};


export default class StreamDatabase {
    private streamDb: StreamObject[] = [];

    private get availablePort(): number {
        const usedPorts = this.streamDb.map(({ port }) => `${port}`);

        // recursively check if the port has been assigned and generate new port number
        const checkPort = (): number => {
            const newPort = Math.floor((Math.random() * STREAM_MIN_PORT) + STREAM_MAX_PORT);
            logger(`testing port ${newPort}`);
            return usedPorts.includes(`${newPort}`) ? checkPort() : newPort;
        }

        logger('assigning port');
        return checkPort();
    }

    private

}