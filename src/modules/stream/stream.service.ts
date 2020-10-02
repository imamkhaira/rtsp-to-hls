import { STREAM_KEEPALIVE_DURATION, STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';
import { logger } from '@/utils';
import Stream, { StreamRequest, StreamResponse } from './stream.entity';

let newPort = 10;
class StreamService {
    constructor (private streams: Stream[] = []) { this.garbageCollector(); }

    /** create array of streams from array of requests */
    public createStreams(requests: StreamRequest[]): StreamResponse[] {
        const newstreams = requests.map(param => new Stream(param.name, param.url, newPort++, STREAM_KEEPALIVE_DURATION));
        this.streams = this.streams.concat(newstreams);
        return newstreams.map(stream => stream.start().toResponse());
    }

    /** stop all streams that matched the given array of ports */
    public stopStreams(ports: number[]): StreamResponse[] {
        const found = this.findStreamsByPorts(ports);
        return found.map(stream => stream.stop().toResponse());;
    }

    /** send hearbeat to all streams that matched the given array of ports */
    public renewStream(ports: number[]): StreamResponse[] {
        const found = this.findStreamsByPorts(ports);
        return found.map(stream => stream.heartbeat().toResponse());
    }

    private findStreamsByPorts(ports: number[]) {
        return this.streams.filter(({ port }) => ports.includes(port));
    }

    private garbageCollector(interval = 30000) {
        return setInterval(async () => {
            if (this.streams.length < 1) return null;
            const copy = this.streams.filter(streams => streams.duration > 0);
            this.streams = copy;
        }, interval);
    }
}

export default new StreamService();