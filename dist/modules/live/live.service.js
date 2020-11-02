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
        define(["require", "exports", "@/entities/response", "./live.processor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const response_1 = __importDefault(require("@/entities/response"));
    const live_processor_1 = __importDefault(require("./live.processor"));
    class LiveServices {
        constructor(default_duration) {
            this.processor = new live_processor_1.default(default_duration);
        }
        start(request) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const streams = yield this.processor.createLiveStreams(request);
                    const data = streams.map((stream) => stream.info);
                    return response_1.default(data);
                }
                catch (e) {
                    throw new Error('Error while starting livestream');
                }
            });
        }
        stop(request) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const streams = yield this.processor.destroyLiveStreams(request);
                    const data = streams.map((stream) => stream.info);
                    return response_1.default(data);
                }
                catch (e) {
                    throw new Error('Error while stopping livestream');
                }
            });
        }
        beat(request) {
            try {
                const streams = this.processor.beatLiveStreams(request);
                const data = streams.map((stream) => stream.info);
                return response_1.default(data);
            }
            catch (e) {
                throw new Error('Error while stopping livestream');
            }
        }
        getRunning() {
            const all = this.processor
                .getRunningLiveStreams()
                .map((stream) => stream.info);
            return response_1.default(all);
        }
    }
    exports.default = LiveServices;
});
