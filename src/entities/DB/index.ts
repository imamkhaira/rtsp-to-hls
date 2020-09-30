import Stream, { StreamRequest } from '@/entities/Stream';
import { STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';
import { logger } from '@/utils';

export default class StreamDB {
    constructor (private db: Stream[] = []) { }

    /**
     * create new stream for each object in request array.
     * the created streams will be started immediately
     */
    public startStreams(request: StreamRequest[]): Stream[] {
        logger(`DB.ts: create stream request with parameter:`, request);
        const newStreams = request.map(({ name, url }) => {
            return new Stream(name, url, this.createUnusedPort());
        });

        this.db.concat(newStreams);
        return newStreams;
    }

    public stopStreams(request: number[]) {
        logger(`DB.ts: processing stop stream request on port:`, request);
        const found = this.db.filter(streams => request.includes(streams.port));
        found.forEach(streams => streams.stop());
        return found;
    }

    public updateHeartbeats(request: number[]) {
        logger(`DB.ts: processing heartbeat request on port:`, request);
        const found = this.db.filter(streams => request.includes(streams.port));
        found.forEach(streams => streams.heartbeart());
        return found;
    }

    public collectGarbageStreams() {
        logger('Collecting and removing closed streams');
        const temp = this.db.filter(streams => streams.ends <= Date.now());
        this.db = [ ...temp ];
        logger(`Active streams:`, this.db);
    }

    private createUnusedPort() {
        const usedPorts = this.db.map(({ port }) => port);
        const unusedPort = (): number => {
            const newPort = Math.floor((Math.random() * STREAM_MAX_PORT) + STREAM_MIN_PORT);
            return !usedPorts.includes(newPort) ? newPort : unusedPort();
        };
        return unusedPort();
    }

}