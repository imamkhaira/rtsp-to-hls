import path from 'path';
import Transcoder from './transcoder';

export interface StreamInstance {
    readonly duration: number;
    readonly public_index: string;
    heartbeat(): boolean;
}

export default class Stream extends Transcoder implements StreamInstance {
    constructor(public readonly url: string, public readonly duration: number) {
        super(url);
    }

    public async start(): Promise<Stream> {
        if (this.isActive) return this;
        await super.start();
        this.timeout = setTimeout(() => this.stop(), this.duration);
        return this;
    }

    public async stop(): Promise<Stream> {
        if (!this.isActive) return this;
        await super.stop();
        return this;
    }

    /** reset the timeout of the process only when the process is active */
    public heartbeat(): boolean {
        if (!this.isActive) return false;
        this.timeout = this.timeout.refresh();
        return true;
    }

    /** return the public location of index.m3u8 */
    public get public_index() {
        return path.join(Stream.PUBLIC_PATH, this.id, Stream.FILE_NAME);
    }

    /* ----------------------------------------------------- */
    /* ---------------------- Privats ---------------------- */

    private timeout!: NodeJS.Timeout;

    /* ----------------------------------------------------- */
    /* ---------------------- Statics ---------------------- */

    public static PUBLIC_PATH = './public';
}
