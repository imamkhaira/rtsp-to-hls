import path from 'path';
import fs from 'fs-extra';
import short_uuid from 'short-uuid';
import child_process from 'child_process';

export interface TranscoderInstance {
    readonly id: string;
    readonly url: string;
    readonly hls_dir: string;
    readonly isActive: boolean;
    start(): Promise<TranscoderInstance>;
    stop(): Promise<TranscoderInstance>;
}

export default class Transcoder implements TranscoderInstance {
    public readonly id: string;

    public readonly hls_dir: string;

    constructor(public readonly url: string) {
        this.id = short_uuid('zurahmi').generate();
        this.hls_dir = path.join(Transcoder.OUTPUT_DIR, this.id);
    }

    public get isActive(): boolean {
        return this.ffmpeg ? !this.ffmpeg.killed : false;
    }

    /** create named folder and spawn process if not yet started */
    public async start(): Promise<Transcoder> {
        if (this.isActive) return this;

        await fs.ensureDir(this.hls_dir);
        this.ffmpeg = child_process.spawn(
            'ffmpeg',
            [
                '-rtsp_transport tcp',
                `-i ${this.url}`,
                '-c:v libx264',
                '-crf 21',
                '-preset veryfast',
                '-g 25 ',
                '-sc_threshold 0',
                '-c:a aac',
                '-b:a 128k',
                '-ac 2',
                '-f hls',
                '-hls_time 6',
                '-hls_playlist_type event',
                '-hls_flags single_file',
                Transcoder.FILE_NAME,
            ],
            { cwd: this.hls_dir, detached: false, shell: true },
        );
        return await this.created_m3u8();
    }

    /** kill process and delete named folder if still active */
    public async stop(): Promise<Transcoder> {
        if (!this.isActive) return this;

        this.ffmpeg.removeAllListeners().kill('SIGKILL');
        await fs.remove(this.hls_dir);
        return this;
    }

    /* ----------------------------------------------------- */
    /* ---------------------- Privats ---------------------- */

    private ffmpeg!: child_process.ChildProcess;

    private created_m3u8(): Promise<Transcoder> {
        return new Promise((resolve) => {
            const watcher = fs.watch(this.hls_dir, (event, file) => {
                if (file === Transcoder.FILE_NAME) {
                    console.log(`doing -${event}- to file -${file}-`);
                    watcher.removeAllListeners();
                    watcher.close();
                    return resolve(this);
                }
            });
        });
    }

    /* ----------------------------------------------------- */
    /* ---------------------- Statics ---------------------- */

    public static readonly FILE_NAME = 'index.m3u8';
    private static OUTPUT_DIR = '/dev/shm/node-transcoder';

    /** set the Transcoder output directory. will be created if nonexistent */
    public static set OUTPUT_DIRECTORY(dir_path: string) {
        fs.ensureDirSync(dir_path);
        Transcoder.OUTPUT_DIR = dir_path;
    }

    /** currently defaults to /dev/shm/node-transcoder */
    public static get OUTPUT_DIRECTORY() {
        return Transcoder.OUTPUT_DIR;
    }
}
