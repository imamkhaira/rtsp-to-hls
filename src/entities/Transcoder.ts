import path from 'path';
import fs from 'fs-extra';
import short_uuid from 'short-uuid';
import child_process from 'child_process';

class Transcoder {
    /* ----------------------- PROPERTIES ----------------------- */

    public readonly id: string;

    private readonly hls_dir: string;

    private ffmpeg!: child_process.ChildProcess;

    /* ----------------------- CONSTRUCTOR ----------------------- */

    constructor(readonly rtsp_url: string, readonly working_directory: string) {
        this.id = short_uuid.generate();
        this.hls_dir = path.join(working_directory, this.id);
    }

    /* --------------------- PROTECTED METHODS --------------------- */

    /** start ffmpeg process and return only if index.m3u8 has been created */
    protected async start(): Promise<Transcoder> {
        await fs.ensureDir(this.hls_dir);
        this.ffmpeg = child_process.spawn(
            `ffmpeg`,
            [
                `-rtsp_transport tcp`,
                `-i ${this.rtsp_url}`,
                `-c:v libx264`,
                `-crf 21`,
                `-preset veryfast`,
                `-g 25`,
                `-sc_threshold 0`,
                `-c:a aac`,
                `-b:a 128k`,
                `-ac 1`,
                `-f hls`,
                `-hls_time 4`,
                `-hls_playlist_type event`,
                `index.m3u8`
            ],
            { cwd: this.hls_dir, detached: false, shell: true }
        );

        return await new Promise((resolve, reject) => {
            // watch for index.m3u8 file creation
            const watcher = fs.watch(this.hls_dir, (_, filename) => {
                if (filename !== 'index.m3u8') return;
                clearTimeout(timer);
                watcher.removeAllListeners().close();
                return resolve(this);
            });

            // and set timer to reject the promise if it takes too long
            const timer = setTimeout(() => {
                watcher.removeAllListeners().close();
                this.ffmpeg.removeAllListeners().kill();
                fs.removeSync(this.hls_dir);
                return reject(`Unable to create index`);
            }, 10000);
        });
    }

    /** stop ffmpeg process and return only if index.m3u8 has been deleted */
    protected async stop(): Promise<Transcoder> {
        this.ffmpeg.removeAllListeners().kill();
        await fs.remove(this.hls_dir);
        return this;
    }

    /* ------------------------- GETTERS ------------------------- */

    /** check if ffmpeg process is still active */
    public get is_active() {
        return this.ffmpeg && !this.ffmpeg.killed;
    }
}

export default Transcoder;
