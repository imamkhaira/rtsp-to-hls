import { v5 as uuidv5 } from 'uuid';
import RTSPStream from 'node-rtsp-stream-es6';
import { logger } from '@/utils';

export interface StreamObject {
    id: string;
    name: string;
    url: string;
    port: number;
    ends: number;
    stream: RTSPStream;
};

export interface StreamRequest {
    name: string;
    url: string;
}

export interface StreamResponse {
    id: string;
    name: string;
    url: string;
    port: number;
    ends: number;
}

export default class Stream implements StreamObject {
    readonly id: string;
    readonly stream: RTSPStream;

    /** create the Stream object. it does not immediately start the stream */
    constructor (
        public name: string,
        public url: string,
        public port: number,
        public ends: number,
    ) {
        this.id = uuidv5(name, 'Stream');
        this.stream = new RTSPStream({ name, url, port });
        logger(`Stream.ts new: creating ${this.name} (${this.id}) on port ${this.port}`);
    }

    /** start the stream */
    public async start() {
        if (this.ends > Date.now()) this.stream.start();
        logger(`Stream.ts start(): starting ${this.name} (${this.id}) on port ${this.port}`);
    }

    /** stop the stream and mark the end to -1 IF end is not -1 */
    public async stop() {
        if (this.ends > 0) this.stream.stop(() => { this.ends = -1; });
    }

    /** update the streams' heartbeat if it is not stopped */
    public set heartbeat(newEnds: number) {
        if (this.ends > Date.now()) this.ends = newEnds;
    }

    public get streamResponse(): StreamResponse {
        const { stream, ...rest } = this;
        return rest;
    }
};

