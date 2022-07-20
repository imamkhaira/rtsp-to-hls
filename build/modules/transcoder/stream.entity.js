"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = void 0;
const short_uuid_1 = __importDefault(require("short-uuid"));
const child_process_1 = __importDefault(require("child_process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
let isCleared = false;
class Stream {
    id;
    sourceUrl;
    workDir;
    keepalive;
    userUid;
    process;
    killAt;
    constructor({ sourceUrl, workDir, keepalive, userUid }) {
        this.id = short_uuid_1.default.generate();
        this.sourceUrl = sourceUrl;
        this.workDir = workDir;
        this.keepalive = keepalive;
        this.userUid = userUid;
        this.killAt = 0;
        if (isCleared === false) {
            fs_extra_1.default.emptyDirSync(workDir);
            isCleared = true;
        }
    }
    getIndex() {
        return path_1.default.join(this.id, 'index.m3u8');
    }
    isActive() {
        return this.killAt > Date.now();
    }
    async start() {
        let watcher;
        const outputDir = path_1.default.join(this.workDir, this.id);
        fs_extra_1.default.ensureDirSync(outputDir);
        console.log(`starting ${this.sourceUrl} at ${outputDir}`);
        this.process = child_process_1.default.spawn('ffmpeg', [
            `-fflags nobuffer`,
            `-flags low_delay`,
            `-rtsp_transport tcp`,
            `-i "${this.sourceUrl}"`,
            `-vsync cfr`,
            `-copyts`,
            `-vcodec copy`,
            `-movflags frag_keyframe+empty_moov`,
            `-an`,
            `-hls_flags delete_segments+append_list`,
            `-f segment`,
            `-segment_wrap 240`,
            `-segment_list_flags live`,
            `-segment_time 0.5`,
            `-segment_format mpegts`,
            `-segment_list_type m3u8`,
            `-segment_list index.m3u8`,
            `%3d.ts`
        ], {
            cwd: outputDir,
            shell: true,
            uid: this.userUid
        });
        this.process.stderr?.on('data', data => {
            return;
        });
        this.process.once('close', () => {
            this.killAt = Date.now();
            fs_extra_1.default.removeSync(path_1.default.join(this.workDir, this.id));
            console.log(`ending ${this.sourceUrl}`);
        });
        watcher = chokidar_1.default.watch(outputDir);
        return await new Promise((resolve, reject) => {
            this.killAt = Date.now() + this.keepalive;
            const waitTimer = setTimeout(async () => {
                await watcher.close();
                this.process.kill();
                console.log(`failed to stream ${this.sourceUrl}`);
                return reject(`Cannot transcode ${this.sourceUrl}`);
            }, this.keepalive - 1000);
            watcher.on('add', async (fileName) => {
                if (!fileName.includes('index.m3u8'))
                    return;
                await watcher.close();
                clearTimeout(waitTimer);
                console.log(`now streaming ${this.sourceUrl}`);
                return resolve(this);
            });
        });
    }
    async stop() {
        this.process.kill();
        return this;
    }
    refresh() {
        this.killAt = Date.now() + this.keepalive;
        console.log(`refreshing ${this.sourceUrl}`);
        return this;
    }
}
exports.Stream = Stream;
