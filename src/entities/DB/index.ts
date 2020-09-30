import Stream, { StreamRequest } from '@/entities/Stream';
import { STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';
import { logger } from '@/utils';

export default class StreamDB {
    private db: Stream[] = [];
    constructor () {
        this.collectGarbageStreams();
    }

    /**
     * create new stream for each object in request array.
     * the created streams will be started immediately
     */
    public startStreams(request: StreamRequest[]): Stream[] {
        const newStreams = request.map(({ name, url }) => new Stream(name, url, this.unusedPort));
        this.db = this.db.concat(newStreams);
        logger(`DB.ts: created stream request: `, this.db);
        return newStreams;
    }

    /**
     * stop the streams that matched the number of port in request array.
     * the created streams will be stopped immediately and left to be
     * collected by the garbage collector.
     * returns the stopped streams array
     */
    public stopStreams(request: number[]): Stream[] {
        logger(`DB.ts: processing stop stream request on port:`, request);
        const found = this.db.filter(streams => request.includes(streams.port));
        found.forEach(streams => streams.stop());
        return found;
    }

    /**
     * send heartbeat to the streams that matched the number of port in
     * request array. returns the updated streams array
     */
    public updateHeartbeats(request: number[]): Stream[] {
        logger(`DB.ts: processing heartbeat request on port:`, request);
        const found = this.db.filter(streams => request.includes(streams.port));
        found.forEach(streams => streams.heartbeart());
        return found;
    }

    /**
     * get a random unused port between STREAM_MIN_PORT and STREAM_MAX_PORT.
     * note that this function runs recursively. returns the port number
     */
    public get unusedPort(): number {
        const usedPorts = this.db.map(({ port }) => `${port}`);
        const unusedPort = (): number => {
            const newPort = Math.floor(
                Math.random() * (STREAM_MAX_PORT - STREAM_MIN_PORT + 1)
            ) + STREAM_MIN_PORT;
            return usedPorts.includes(`${newPort}`) ? unusedPort() : newPort;
        };
        return unusedPort();
    }

    /**
     * prune stopped streams from database. to be run periodically by the constructor
     */
    private collectGarbageStreams(duration = 10000) {
        return setInterval(() => {
            if (this.db.length > 1) {
                const garbages = this.db.filter(({ ends }) => (ends <= Date.now()));
                if (garbages.length > 0) {
                    garbages.forEach((garbage, index) => {
                        garbage.stop();
                        this.db.splice(index);
                        logger(`DB.ts: removing garbage stream:`, garbage);
                    });
                }
            }
        }, duration);
    }
}