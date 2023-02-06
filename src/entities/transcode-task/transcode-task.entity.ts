import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { generate as generateUuid } from 'short-uuid';
import { watch } from 'chokidar';
import { join } from 'path';
import { DEFAULT_KEEPALIVE, RUNAS_UID, TEMP_DIR } from '../../config/config';
import { ensureDirSync, removeSync } from 'fs-extra';

// const x = spawn('kontol', [`ukuran 10`], { cwd: '/', shell: true,});

interface TranscodeTask {
    id: string;
    sourceUrl: string;
    process: ChildProcessWithoutNullStreams;
    streamDir: string;
    killAt: number;
}

function refreshTask(transcodeTask: TranscodeTask) {
    transcodeTask.killAt = Date.now() + DEFAULT_KEEPALIVE;
    return transcodeTask;
}

function killTask(transcodeTask: TranscodeTask) {
    transcodeTask.process.kill();
    return transcodeTask;
}

async function createTask(sourceUrl: string) {
    /** the stream id */
    const id = generateUuid();
    /** the stream working drectory */
    const streamDir = join(TEMP_DIR, id);
    /** when to kill the stream, set it to now but update later if success */
    const killAt = Date.now();
    ensureDirSync(streamDir);
    const process = spawn(
        'ffmpeg',
        [
            `-fflags nobuffer`,
            `-flags low_delay`,
            //`-rtsp_transport tcp`,
            // TODO: add sanitization to sourceUrls
            `-i "${sourceUrl}"`,
            `-vsync cfr`,
            `-copyts`,
            `-vcodec copy`,
            `-movflags frag_keyframe+empty_moov`,
            `-an`,
            `-hls_flags delete_segments+append_list`,
            `-f segment`,
            `-segment_wrap 4`,
            `-segment_list_flags live`,
            `-segment_time 0.5`,
            `-segment_format mpegts`,
            `-segment_list_type m3u8`,
            `-segment_list index.m3u8`,
            `%3d.ts`
        ],
        {
            cwd: TEMP_DIR,
            shell: true,
            uid: RUNAS_UID
        }
    );

    const transcodeTask: TranscodeTask = { id, streamDir, sourceUrl, process, killAt };
    process.stderr.on('data', data => void data); // attach to stderr but destroy the data

    const watcher = watch(streamDir);

    return new Promise((resolve, reject) => {
        const waitTimer = setTimeout(async () => {
            await watcher.close();
            process.kill();
            reject(`cannot transcode from source: ${sourceUrl}`);
        }, DEFAULT_KEEPALIVE);
        watcher.on('add', async filename => {
            if (!filename.includes('index.m3u8')) return;
            await watcher.close();
            clearTimeout(waitTimer);
            transcodeTask.killAt = Date.now() + DEFAULT_KEEPALIVE;
            resolve(transcodeTask);
        });
    });
}
