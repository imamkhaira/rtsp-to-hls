import shortUUID from 'short-uuid';
import childProcess from 'child_process';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import path from 'path';
import { Manageable } from './types';

let isCleared = false;

export interface StreamConfig {
    sourceUrl: string;
    workDir: string;
    keepalive: number;
    userUid?: number;
}

/**
 * Abstraction of `ffmpeg` process and directory creation.
 */
export class Stream implements Manageable {
    public readonly id: string;
    public readonly sourceUrl: string;
    public readonly workDir: string;
    public readonly keepalive: number;
    public readonly userUid?: number;

    private process!: childProcess.ChildProcess;
    private killAt: number;

    constructor({ sourceUrl, workDir, keepalive, userUid }: StreamConfig) {
        this.id = shortUUID.generate();
        this.sourceUrl = sourceUrl;
        this.workDir = workDir;
        this.keepalive = keepalive;
        this.userUid = userUid;
        this.killAt = 0;

        if (isCleared === false) {
            fs.emptyDirSync(workDir);
            isCleared = true;
        }
    }

    /**
     * get the location of the `index.m3u8` file
     * relative to the `workdir`
     * @returns {string} path to `index.m3u8`
     */
    public getIndex(): string {
        return path.join(this.id, 'index.m3u8');
    }

    /**
     * true if the stream's `keepalive` timestamp is not expired
     * @returns true or false
     */
    public isActive() {
        return this.killAt > Date.now();
    }

    /**
     * Start the `ffmpeg` process,
     * then returns this stream once it is active.
     * If the stream failed to run (file `index.m3u8` is never created)
     * it will reject with failed message
     * @returns this stream
     */
    public async start(): Promise<Stream> {
        let watcher: chokidar.FSWatcher;
        const outputDir = path.join(this.workDir, this.id);

        fs.ensureDirSync(outputDir);
        console.log(`starting ${this.sourceUrl} at ${outputDir}`);
        this.process = childProcess.spawn(
            'ffmpeg',
            [
                `-fflags nobuffer`,
                `-nostats`,
                `-hide_banner`,
                `-loglevel error`,
                `-rtsp_transport tcp`,
                `-analyzeduration 10000000`,
                `-probesize 10000000`,
                `-use_wallclock_as_timestamps 1`,
                `-fpsprobesize 50`,
                `-i "${this.sourceUrl}"`,
                `-fps_mode cfr`,
                `-r 30`,
                `-c:v copy`,
                `-c:a copy`,
                `-movflags frag_keyframe+empty_moov`,
                `-hls_flags delete_segments+append_list`,
                `-f segment`,
                `-segment_list_flags live`,
                `-segment_wrap 5`,
                `-segment_time 0.5`,
                `-segment_list_size 5`,
                `-segment_format mpegts`,
                `-segment_list index.m3u8`,
                `-segment_list_type m3u8`,
                `"%d.ts"`,
                ] ,
            {
                cwd: outputDir,
                shell: true,
                uid: this.userUid
            }
        );

        this.process.stderr?.on('data', data => {
            console.error(`stderr: ${data}`);
            return void data;
        });

        this.process.stdout?.on('data', data => {
            // console.error(`stdout: ${data}`);
            return void data;
        });


        this.process.once('close', () => {
            this.killAt = Date.now();
            fs.removeSync(path.join(this.workDir, this.id));
            console.log(`ending ${this.sourceUrl}`);
        });

        watcher = chokidar.watch(outputDir);
        return await new Promise((resolve, reject) => {
            this.killAt = Date.now() + this.keepalive;

            const waitTimer = setTimeout(async () => {
                await watcher.close();
                this.process.kill();
                console.log(`failed to stream ${this.sourceUrl}`);
                return reject(`Cannot transcode ${this.sourceUrl}`);
            }, this.keepalive - 1000);

            watcher.on('add', async fileName => {
                if (!fileName.includes('index.m3u8')) return;
                await watcher.close();
                clearTimeout(waitTimer);
                console.log(`now streaming ${this.sourceUrl}`);
                return resolve(this);
            });
        });
    }

    /**
     * Stop ffmpeg process and return this stream
     * @returns this stream
     */
    public async stop(): Promise<Stream> {
        this.process.kill();
        return this;
    }

    /**
     * Check if stream is not killed yet,
     * then increase the stream lifetime.
     * @returns this stream
     */
    public refresh(): Stream {
        this.killAt = Date.now() + this.keepalive;
        return this;
    }
}
