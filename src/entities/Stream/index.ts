import RTSPStream from 'node-rtsp-stream-es6';
import { v4 as uuidv4, NIL } from 'uuid';
import { STREAM_KEEPALIVE_DURATION } from '@/config';
import { logger } from '@/utils';
import { StreamObject } from './types';
export { StreamRequest, StreamResponse } from './types';

export default class Stream implements StreamObject {
    public id = NIL;
    public name = NIL;
    public url = NIL;
    public port = 0;
    public ends = 0;
    public stream: RTSPStream;

    /** Create a new Stream object from its name, url and port and start it immediately */
    constructor (name: string, url: string, port: number) {
        this.id = uuidv4();
        this.name = name;
        this.url = url;
        this.port = port;
        this.stream = new RTSPStream({ name, url, port });
        this.ends = Date.now() + STREAM_KEEPALIVE_DURATION;
        this.stream.start();
        logger(`Stream.ts: starting ${this.name} (${this.id}) on port ${this.port}`);
    }

    /** stop the stream object, set its end date to now() and reset the port to -1 */
    public stop() {
        logger(`Stream.ts: stopping ${this.name} (${this.id}) on port ${this.port}`);
        if (this.port > 0) this.stream.stop(() => true);
        this.ends = Date.now();
        this.port = -1;
    }

    /** extends the stream duration into STREAM_KEEPALIVE_DURATION miliseconds from now() */
    public heartbeart() {
        logger(`Stream.ts: heartbeat ${this.name} (${this.id}) on port ${this.port}`);
        this.ends = Date.now() + STREAM_KEEPALIVE_DURATION;
    }
}