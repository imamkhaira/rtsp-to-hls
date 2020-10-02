import { v4 as uuid } from 'uuid';
import RTSPStream from 'node-rtsp-stream-es6';
import { logger } from '@/utils';

export interface StreamRequest {
    name: string;
    url: string;
}

export interface StreamResponse extends StreamRequest {
    id: string;
    port: number;
    duration: number;
}

export default class Stream extends RTSPStream implements StreamResponse {
    public id: string;
    private timer!: NodeJS.Timeout;

    constructor (
        public name: string,
        public url: string,
        public port: number,
        public duration: number
    ) {
        super({ name, url, port });
        this.id = uuid();
    }

    /** start the stream and begin the shutdown timer if the duration has been set. */
    public start() {
        if (this.duration > 0) {
            super.start();
            this.heartbeat();
        }

        logger(`stream: started ${this.name} on ${this.port}`);
        return this;
    }


    /** stop the stream, set the duration to -1 and remove the shutdown timer */
    public stop() {
        if (this.duration > 0) super.stop(() => null);
        if (this.timer) clearTimeout(this.timer);
        this.duration = -1;

        logger(`stream: stopped ${this.name} on ${this.port}`);
        return this;
    }


    /** clear old timer (if it exist) and set up new one with same duration */
    public heartbeat() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.stop(), this.duration);

        logger(`stream: heartbeat for ${this.name} on ${this.port}`);
        return this;
    }

    /** create the response object for JSON purpose */
    public toResponse(): StreamResponse {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            port: this.port,
            duration: Date.now() + this.duration,
        };
    }
}