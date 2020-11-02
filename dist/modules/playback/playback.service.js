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
        define(["require", "exports", "@/entities/response", "./playback.processor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const response_1 = __importDefault(require("@/entities/response"));
    const playback_processor_1 = __importDefault(require("./playback.processor"));
    class PlaybackServices {
        constructor(default_duration) {
            this.processor = new playback_processor_1.default(default_duration);
        }
        start(request) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const stream = yield this.processor.createPlayback(request);
                    return response_1.default(stream);
                }
                catch (e) {
                    throw new Error('Error while starting playback');
                }
            });
        }
        stop(request) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const stream = yield this.processor.destroyPlayback(request);
                    return response_1.default(stream);
                }
                catch (e) {
                    throw new Error('Error while starting playback');
                }
            });
        }
        beat(request) {
            try {
                const stream = this.processor.beatPlayback(request);
                return response_1.default(stream);
            }
            catch (e) {
                throw new Error('Error while starting playback');
            }
        }
        getRunning() {
            const all = this.processor
                .getRunningPlaybacks()
                .map((stream) => stream.info);
            return response_1.default(all);
        }
    }
    exports.default = PlaybackServices;
});
