import { STREAM_MAX_PORT, STREAM_MIN_PORT, STREAM_KEEPALIVE_DURATION } from '@/config';
import { logger } from '@/utils';
import Stream, { StreamRequest } from './stream.entity';

export default class StreamProcessor {
    private event = new Event('gc');

    constructor (private db: Stream[] = []) {
        this.collectGarbageStreams();
    }

    /**
     * create new stream for each object in request array.
     * the created streams will be started immediately
     */
    public startStreams(request: StreamRequest[]): Stream[] {
        const ends = Date.now() + STREAM_KEEPALIVE_DURATION;
        const newstream = request.map(({ name, url }) => new Stream(name, url, this.unusedPort, ends));
        newstream.forEach(stream => stream.start());
        this.db = this.db.concat(newstream);

        logger(`DB.ts: created stream request on ${ends}`);
        return newstream;
    }

    /**
     * stop the streams that matched the number of port in request array.
     * the created streams will be stopped immediately and left to be
     * collected by the garbage collector. returns the stopped streams array
     */
    public stopStreams(request: number[]): Stream[] {
        const stopped = this.db.filter(streams => request.includes(streams.port));
        stopped.forEach(streams => streams.stop());

        logger(`DB.ts: processing stop request on port:`, request);
        return stopped;
    }

    /**
     * send heartbeat to the streams that matched the number of port in
     * request array. returns the updated streams array
     */
    public updateHeartbeats(request: number[]): Stream[] {
        const newEnds = Date.now() + STREAM_KEEPALIVE_DURATION;
        const updated = this.db.filter(streams => request.includes(streams.port));
        updated.forEach(streams => streams.heartbeat = newEnds);

        logger(`DB.ts: updated heartbeat request on:`, request);
        return updated;
    }

    /** returns all the streams in the database */
    public get activeStreams(): Stream[] {
        return [ ...this.db ];
    }

    /**
     * get a random unused port between STREAM_MIN_PORT and STREAM_MAX_PORT.
     * note that this function runs recursively. returns the port number
     */
    private get unusedPort(): number {
        const usedPorts = this.db.map(({ port }) => port);
        const unusedPort = (): number => {
            const newPort = Math.floor(
                Math.random() * (STREAM_MAX_PORT - STREAM_MIN_PORT + 1)
            ) + STREAM_MIN_PORT;
            return usedPorts.includes(newPort) ? unusedPort() : newPort;
        };
        return unusedPort();
    }

    /**
     * prune stopped streams from database. to be run periodically
     * and triggered by the constructor
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