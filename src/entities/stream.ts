import Transcoder from './transcoder';
import { join } from 'path';

export default class Stream {
    private transcoder: Transcoder;

    private timeout: NodeJS.Timeout | undefined;

    constructor(public readonly url: string, public readonly duration: number) {
        this.transcoder = new Transcoder(url);
    }

    /* ---------------------- Publics ---------------------- */

    public async start() {
        if (this.transcoder.isActive) return this;

        await this.transcoder.start();
        this.timeout = this.createTimeout();
        return this;
    }

    public async stop() {
        if (!this.transcoder.isActive) return this;

        await this.transcoder.stop();
        this.timeout = this.deleteTimeout();
        return this;
    }

    public heartbeat() {
        if (!this.transcoder.isActive) return false;

        this.timeout = this.deleteTimeout();
        this.timeout = this.createTimeout();
        return true;
    }

    public get public_m3u8(): string {
        return this.transcoder.isActive
            ? join(Stream.PUBLIC_PATH, this.transcoder.id, Transcoder.FILE_NAME)
            : ((null as unknown) as string);
    }

    /* ---------------------- Privates ---------------------- */

    private createTimeout() {
        return setTimeout(() => this.stop(), this.duration);
    }

    private deleteTimeout() {
        return void (this.timeout && clearTimeout(this.timeout));
    }

    /* ---------------------- Statics ---------------------- */

    public static PUBLIC_PATH = '/streams';

    public static TRANSCODER_OUTPUT_DIRECTORY = Transcoder.OUTPUT_DIRECTORY;
}
