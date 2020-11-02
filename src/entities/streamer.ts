import path from 'path';
import Transcoder from './transcoder';

export interface StreamerInstance {
    readonly duration: number;
    heartbeat(): StreamerInstance;
}

export default class Streamer extends Transcoder implements StreamerInstance {
    private timeout!: NodeJS.Timeout;

    constructor(public readonly url: string, public readonly duration: number) {
        super(url);
    }

    public async start(): Promise<Streamer> {
        if (this.is_active) return this;
        await super.start();
        this.timeout = setTimeout(() => void this.stop(), this.duration);
        return this;
    }

    public async stop(): Promise<Streamer> {
        if (!this.is_active) return this;
        await super.stop();
        return this;
    }

    /** reset the timeout of the process only when the process is active */
    public heartbeat(): Streamer {
        if (!this.is_active) return this;
        this.timeout = this.timeout.refresh();
        return this;
    }

    /** get object that contains basic info about the streamer */
    public get info() {
        return {
            id: this.id,
            url: this.url,
            duration: this.duration,
            is_active: this.is_active,
            public_index:
                Streamer.PUBLIC_PATH +
                path.join('/', this.id, Streamer.FILE_NAME),
        };
    }

    /* ----------------------------------------------------- */
    /* ---------------------- Privats ---------------------- */

    /* ----------------------------------------------------- */
    /* ---------------------- Statics ---------------------- */

    public static PUBLIC_PATH = 'localhost:3000/hls';
}
