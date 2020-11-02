const { exec, spawn, spawnSync } = require('child_process');
const fs = require('fs-extra');

const sourceUrl = 'rtsp://192.168.100.123/ch04.264';
const outDir = '/Users/batman/p/transcoding-server/src/output';
function main() {
    fs.emptyDirSync(outDir);
    const anak = spawn(
        'ffmpeg',
        [
            `-fflags nobuffer`,
            `-rtsp_transport tcp`,
            `-i ${sourceUrl}`,
            `-vsync 1`,
            `-c copy`,
            `-preset ultrafast`,
            `-movflags frag_keyframe+empty_moov`,
            `-an`,
            `-f hls`,
            `-hls_init_time 1`,
            `-hls_time 10`,
            `-hls_list_size 10`,
            `-hls_flags delete_segments`,
            `-start_number 1`,
            `index.m3u8`,
        ],
        {
            cwd: outDir,
            shell: true,
            uid: 501,
        },
    );

    anak.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    anak.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    anak.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    setTimeout(() => null, 100000000);
}

main();

/* 

spawn(
    'ffmpeg',
    [
        // `-fflags nobuffer`,
        // `-stimeout 100000`,
        // `-rtsp_transport tcp`,
        `-i ${sourceUrl}`,
        `-f hls`,
        `-c copy`,
        `-buffer 1M`
        `-hls_init_time 1`,
        `-hls_time 2`,
        `-hls_list_size 10`,
        `-hls_flags delete_segments`,
        `-start_number 1`,
        `index.m3u8`,
    ],
    {
        cwd: '/Users/batman/p/transcoding-server/src/output',
        shell: true,
        uid: 501,
    },
);

*/
