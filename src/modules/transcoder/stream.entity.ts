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

    public getIndex(): string {
        return path.join(this.id, 'index.m3u8');
    }

    public isActive() {
        return this.killAt > Date.now();
    }

    public async start(): Promise<Stream> {
        let watcher: chokidar.FSWatcher;
        const outputDir = path.join(this.workDir, this.id);

        fs.ensureDirSync(outputDir);

        console.log(`starting ${this.sourceUrl} at ${outputDir}`);
        this.process = childProcess.spawn(
            'ffmpeg',
            [
                `-fflags nobuffer`,
                `-rtsp_transport tcp`,
                // '-analyzeduration 20',
                // '-probesize 10M',
                `-i "${this.sourceUrl}"`,
                // `-vsync 1`,
                `-c:v copy`,
                `-c:a copy`,
                // `-preset ultrafast`,
                // `-movflags frag_keyframe+empty_moov`,
                `-an`,
                `-f hls`,
                `-hls_init_time 1`,
                `-hls_time 5`,
                `-hls_list_size 10`,
                `-hls_flags delete_segments`,
                `-start_number 1`,
                `index.m3u8`
            ],
            {
                cwd: outputDir,
                shell: true,
                uid: this.userUid
            }
        );

        this.process.stderr?.on('data', data => {
            console.error(`stderr: ${data}`);
            return;
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

    public async stop(): Promise<Stream> {
        this.process.kill();
        return this;
    }

    public refresh(): Stream {
        this.killAt = Date.now() + this.keepalive;
        console.log(`refreshing ${this.sourceUrl}`);
        return this;
    }
}
