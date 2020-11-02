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
        define(["require", "exports", "path", "./transcoder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = __importDefault(require("path"));
    const transcoder_1 = __importDefault(require("./transcoder"));
    class Streamer extends transcoder_1.default {
        constructor(url, duration) {
            super(url);
            this.url = url;
            this.duration = duration;
        }
        start() {
            const _super = Object.create(null, {
                start: { get: () => super.start }
            });
            return __awaiter(this, void 0, void 0, function* () {
                if (this.is_active)
                    return this;
                yield _super.start.call(this);
                this.timeout = setTimeout(() => void this.stop(), this.duration);
                return this;
            });
        }
        stop() {
            const _super = Object.create(null, {
                stop: { get: () => super.stop }
            });
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.is_active)
                    return this;
                yield _super.stop.call(this);
                return this;
            });
        }
        heartbeat() {
            if (!this.is_active)
                return this;
            this.timeout = this.timeout.refresh();
            return this;
        }
        get info() {
            return {
                id: this.id,
                url: this.url,
                duration: this.duration,
                is_active: this.is_active,
                public_index: Streamer.PUBLIC_PATH +
                    path_1.default.join('/', this.id, Streamer.FILE_NAME),
            };
        }
    }
    exports.default = Streamer;
    Streamer.PUBLIC_PATH = 'localhost:3000/hls';
});
