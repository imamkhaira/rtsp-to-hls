import fs from 'fs-extra';
import { join } from 'path';
import { ChildProcess, spawn } from 'child_process';
import logger from '@/shared/Logger';

export class Transcoder {
    public static ROOT_DIR: string;

    public readonly hls_dir!: string;

    private ffmpeg!: ChildProcess;

    constructor(public readonly id: string, public readonly url: string) {
        this.hls_dir = join(Transcoder.ROOT_DIR, id);
    }

    public async start(): Promise<number> {
        if (!this.isActive) {
            await fs.ensureDir(this.hls_dir);
            this.ffmpeg = spawn(
                'ffmpeg',
                [
                    '-rtsp_transport tcp',
                    `-i ${this.url}`,
                    '-c:v libx264',
                    '-crf 21',
                    '-preset veryfast',
                    '-g 25',
                    '-sc_threshold 0',
                    '-c:a aac',
                    '-b:a 128k',
                    '-ac 2',
                    '-f hls',
                    '-hls_time 4',
                    '-hls_playlist_type event',
                    '-hls_flags single_file',
                    this.m3u8,
                ],
                { detached: false },
            );

            this.ffmpeg.stdout?.on('data', (chunk) =>
                logger.info(`data is ${chunk}`),
            );
        }
        return this.ffmpeg.pid;
    }

    public async stop(): Promise<number> {
        if (this.isActive) {
            const pid = this.ffmpeg.pid;
            this.ffmpeg.removeAllListeners().kill();
            await fs.remove(this.hls_dir);
            return pid;
        }
        return -1;
    }

    public get isActive(): boolean {
        return this.ffmpeg ? !this.ffmpeg.killed : false;
    }

    public get process_pid(): number {
        return this.ffmpeg.pid;
    }

    public get m3u8(): string {
        return join(this.hls_dir, 'index.m3u8');
    }
}

export default function TranscoderGenerator(root_path: string) {
    fs.ensureDirSync(root_path);
    Transcoder.ROOT_DIR = root_path;
    return Transcoder;
}

/*
const hls_dir = path.join(root_dir, id);
    const process = spawn('ffmpeg', [
        '-rtsp_transport tcp',
        `-i ${url}`,
        '-c:v libx264',
        '-crf 21',
        '-preset veryfast',
        '-g 25',
        '-sc_threshold 0',
        '-c:a aac',
        '-b:a 128k',
        '-ac 2',
        '-f hls',
        '-hls_time 4',
        '-hls_playlist_type event',
        '-hls_flags single_file',
        path.join(hls_dir, 'stream.m3u8'),
    ]);

rtsp://192.168.100.150:554/ch07.264
rtsp://192.168.100.150:554/ch08.264

url=rtsp://192.168.100.150:554/ch08.264

ffmpeg -rtsp_transport tcp -i $url -c:v libx264 -crf 21 -preset veryfast -g 25 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -f hls -hls_time 4 -hls_playlist_type event -hls_flags single_file /dev/shm/jokowi/t123/index.m3u8
        
 */
