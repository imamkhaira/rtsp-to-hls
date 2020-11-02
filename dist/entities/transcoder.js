var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "fs-extra", "short-uuid", "child_process", "@/shared/Logger"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = __importDefault(require("path"));
    const fs_extra_1 = __importDefault(require("fs-extra"));
    const short_uuid_1 = __importDefault(require("short-uuid"));
    const child_process_1 = __importDefault(require("child_process"));
    const Logger_1 = __importDefault(require("@/shared/Logger"));
    class Transcoder {
        constructor(url) {
            this.url = url;
            this.id = short_uuid_1.default().generate();
            this.hls_dir = path_1.default.join(Transcoder.OUTPUT_DIR, this.id);
        }
        get is_active() {
            return this.ffmpeg ? !this.ffmpeg.killed : false;
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.is_active)
                    return this;
                yield fs_extra_1.default.ensureDir(this.hls_dir);
                this.ffmpeg = child_process_1.default.spawn(`ffmpeg`, [
                    `-rtsp_transport tcp`,
                    `-i ${this.url}`,
                    `-c:v copy`,
                    `-crf 21`,
                    `-preset ultrafast`,
                    `-g 25`,
                    `-sc_threshold 0`,
                    `-c:a copy`,
                    `-b:a 128k`,
                    `-ac 1`,
                    `-f hls`,
                    `-hls_time 1`,
                    `-hls_flags delete_segments`,
                    Transcoder.FILE_NAME,
                ], { cwd: this.hls_dir, detached: false, shell: true });
                return yield this.created_m3u8();
            });
        }
        stop() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.is_active)
                    return this;
                this.ffmpeg.removeAllListeners().kill('SIGKILL');
                yield fs_extra_1.default.remove(this.hls_dir);
                return this;
            });
        }
        created_m3u8() {
            return new Promise((resolve) => {
                const watcher = fs_extra_1.default.watch(this.hls_dir, (event, file) => {
                    if (file === Transcoder.FILE_NAME) {
                        Logger_1.default.info(`doing -${event}- to file -${file}-`);
                        watcher.removeAllListeners();
                        watcher.close();
                        return resolve(this);
                    }
                });
            });
        }
        static set OUTPUT_DIRECTORY(dir_path) {
            fs_extra_1.default.ensureDirSync(dir_path);
            Transcoder.OUTPUT_DIR = dir_path;
        }
        static get OUTPUT_DIRECTORY() {
            return Transcoder.OUTPUT_DIR;
        }
    }
    exports.default = Transcoder;
    Transcoder.FILE_NAME = 'index.m3u8';
    Transcoder.OUTPUT_DIR = '/dev/shm/node-transcoder';
});
