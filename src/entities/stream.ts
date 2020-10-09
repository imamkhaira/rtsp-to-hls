import { v4 as uuid } from 'uuid';
import RTSPStream from 'node-rtsp-stream-es6';
import { STREAM_KEEPALIVE_DURATION } from '@/config';

export interface StreamResponse {
    id: string;
    name: string;
    url: string;
    port: number;
    duration: number;
}

export type StreamRequest = {
    name: string;
    url: string;
};

export default class Stream extends RTSPStream implements StreamResponse {
    shutdownTimer!: NodeJS.Timeout;

    constructor(
        public name: string,
        public url: string,
        public port: number,
        public duration = STREAM_KEEPALIVE_DURATION,
        public id = uuid(),
    ) {
        super({ name, url, port });
    }

    public async start(): Promise<Stream> {
        if (this.duration > 0) {
            super.start();
            this.heartbeat();
        }
        return this;
    }

    public async stop(): Promise<Stream> {
        if (this.duration > 0) {
            super.stop(() => null);
            this.duration = this.port = -1;
            if (this.shutdownTimer) clearTimeout(this.shutdownTimer);
        }
        return this;
    }

    public async heartbeat(): Promise<Stream> {
        if (this.shutdownTimer) clearTimeout(this.shutdownTimer);
        if (this.duration > 0)
            this.shutdownTimer = setTimeout(() => this.stop(), this.duration);
        return this;
    }

    public get json(): string {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            url: this.url,
            port: this.port,
            duration: this.duration,
        } as StreamResponse);
    }
}

/**
 * test scenarios:
 * 1. start() -> stop() : can, duration n, -1
 * 2. start() -> heartbeat() -> stop() : can, duration n, n, -1
 * 3. start() -> stop() -> heartbeat() : cant, duration n, -1, -1
 */
