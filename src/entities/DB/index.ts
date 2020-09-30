import Stream, { StreamRequest } from '@/entities/Stream';
import { STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';
import { logger } from '@/utils';

export default class StreamDB {
    constructor (private db: Stream[] = []) {
        setInterval(this.collectGarbageStreams, 10000);
    }

    /**
     * create new stream for each object in request array.
     * the created streams will be started immediately
     */
    public startStreams(request: StreamRequest[]): Stream[] {
        logger(`DB.ts: create stream request with parameter:`, request);
        const newStreams = request.map(({ name, url }) => {
            return new Stream(name, url, this.unusedPort);
        });

        this.db.concat(newStreams);
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
        const usedPorts = this.db.map(({ port }) => port);
        const unusedPort = (): number => {
            const newPort = Math.floor((Math.random() * STREAM_MAX_PORT) + STREAM_MIN_PORT);
            return !usedPorts.includes(newPort) ? newPort : unusedPort();
        };
        return unusedPort();
    }

    private collectGarbageStreams(): void {
        logger('Collecting and removing closed streams');
        const temp = this.db.filter(streams => streams.ends <= Date.now());
        this.db = [ ...temp ];
        logger(`Active streams:`, this.db);
    }

}