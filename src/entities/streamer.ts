import path from 'path';
import Transcoder from './transcoder';

export interface StreamerInstance {
    readonly duration: number;
    readonly public_index: string;
    heartbeat(): boolean;
}

export default class Streamer extends Transcoder implements StreamerInstance {
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
    public heartbeat(): boolean {
        if (!this.is_active) return false;
        this.timeout = this.timeout.refresh();
        return true;
    }

    /** return the public location of index.m3u8 */
    public get public_index() {
        return path.join(Streamer.PUBLIC_PATH, this.id, Streamer.FILE_NAME);
    }

    /** get object that contains basic info about the streamer */
    public get info() {
        return {
            id: this.id,
            url: this.url,
            duration: this.duration,
            is_active: this.is_active,
            public_index: this.public_index,
        };
    }

    /* ----------------------------------------------------- */
    /* ---------------------- Privats ---------------------- */

    private timeout!: NodeJS.Timeout;

    /* ----------------------------------------------------- */
    /* ---------------------- Statics ---------------------- */

    public static PUBLIC_PATH = './public';
}
