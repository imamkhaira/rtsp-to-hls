import path from 'path';
import fs from 'fs-extra';
import short_uuid from 'short-uuid';
import child_process from 'child_process';

export default class Transcoder {
    public readonly id: string;

    public readonly url: string;

    public readonly hls_dir: string;

    private ffmpeg!: child_process.ChildProcess;

    constructor(url: string) {
        this.id = short_uuid.generate();
        this.url = url;
        this.hls_dir = path.join(Transcoder.WORKING_DIR, this.id);
    }

    /* ---------------------- Publics ---------------------- */

    /**
     * if the process hasnt started, create a named folder in
     * the root directory, then spawns a ffmpeg process. returns
     * the pid if the HLS index file has been successfully created.
     * @returns number: pid of ffmpeg process
     */
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
                '-hls_time 4',
                '-hls_playlist_type event',
                '-hls_flags single_file',
                'index.m3u8',
            ],
            { cwd: this.hls_dir, detached: false, shell: true },
        );
        return await this.created_m3u8();
    }

    /**
     * if ffmpeg hasnt stopped, kill ffmpeg process then
     * remove the named directory and return the killed pid;
     * @returns number: pid of killed process
     */
    public async stop(): Promise<Transcoder> {
        if (!this.isActive) return this;
        this.ffmpeg.removeAllListeners().kill('SIGKILL');
        await fs.remove(this.hls_dir);
        return this;
    }

    /**
     * get the status of the process
     * @returns boolean
     */
    public get isActive(): boolean {
        return this.ffmpeg ? !this.ffmpeg.killed : false;
    }

    /**
     * return the pid of the spawned child process.
     * otherwise return -1 if ffmpeg is never spawned.
     * @returns string : the pid of the process or -1
     */
    public get pid() {
        return this.ffmpeg ? this.ffmpeg.pid : -1;
    }

    /* ---------------------- Privats ---------------------- */

    /**
     * watch the work dir for index.m3u8 file.
     * when the file is created, return this instance
     * and kill the watcher
     */
    private created_m3u8(): Promise<Transcoder> {
        return new Promise((resolve) => {
            const watcher = fs.watch(this.hls_dir, (event, file) => {
                if (event === 'rename' && file === 'index.m3u8') {
                    console.log(`doing -${event}- to file -${file}-`);
                    watcher.removeAllListeners();
                    watcher.close();
                    return resolve(this);
                }
            });
        });
    }

    /* ---------------------- Statics ---------------------- */

    public static readonly FILE_NAME = 'index.m3u8';

    public static WORKING_DIR = '/dev/shm/node-transcoder';

    public static set TRANSCODER_DIRECTORY(dir_path: string) {
        fs.ensureDirSync(dir_path);
        Transcoder.WORKING_DIR = dir_path;
    }

    public static get TRANSCODER_DIRECTORY() {
        return Transcoder.WORKING_DIR;
    }
}

// test code
// fs.ensureDirSync(Transcoder.STREAM_DIRECTORY);
// let test = new Transcoder('rtsp://192.168.100.150:554/ch08.264');
// test.start()
//     .then((proc) => {
//         console.log(
//             `Active with id: ${proc.id}, pid: ${proc.pid} directory: ${proc.hls_dir}`,
//         );
//         console.log(
//             'file m3u8 exists:',
//             fs.existsSync(proc.hls_dir + '/index.m3u8'),
//         );
//         return proc.stop();
//     })
//     .then((proc) => {
//         console.log(`Inactive with pid: ${proc.pid}`);
//         console.log(
//             'file m3u8 exists:',
//             fs.existsSync(proc.hls_dir + '/index.m3u8'),
//         );
//     });
