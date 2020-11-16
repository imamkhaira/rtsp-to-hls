import path from 'path';
import Transcoder from './Transcoder';

class Stream extends Transcoder {
    /* ----------------------- PROPERTIES ----------------------- */

    private timeout!: NodeJS.Timeout;

    private next_refresh!: number;

    /* ----------------------- CONSTRUCTOR ----------------------- */

    constructor(
        readonly rtsp_url: string,
        readonly duration: number,
        readonly working_directory: string
    ) {
        super(rtsp_url, working_directory);
    }

    /* --------------------- PROTECTED METHODS --------------------- */

    public async start() {
        await super.start();
        this.timeout = setTimeout(() => void this.stop(), this.duration);
        this.next_refresh = Math.floor(Date.now() + this.duration / 2);
        return this;
    }

    protected async stop() {
        await super.stop();
        clearTimeout(this.timeout);
        return this;
    }

    public refresh() {
        if (Date.now() < this.next_refresh) return this;
        this.timeout.refresh();
        this.next_refresh = Math.floor(Date.now() + this.duration / 2);
        return this;
    }

    /* ------------------------- GETTERS ------------------------- */

    /** get the index.m3u8 file location relative to stream root url */
    public get hls_url() {
        return path.join(this.id, 'index.m3u8');
    }

    /**
     * returns the metadata object: {id, url, hls_url, is_active}
     * @param hls_root_url the designated root url of the stream, ex: http://localhost:3000/stream
     * */
    public get_metadata(hls_root_url = '') {
        return {
            id: this.id,
            rtsp_url: this.rtsp_url,
            hls_url: `${hls_root_url}/${this.hls_url}`,
            is_active: this.is_active,
            next_refresh: this.next_refresh
        };
    }
}

export default Stream;
