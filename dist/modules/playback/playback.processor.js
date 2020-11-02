var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@/entities/streamer", "@/entities/streamer-db"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const streamer_1 = __importDefault(require("@/entities/streamer"));
    const streamer_db_1 = __importDefault(require("@/entities/streamer-db"));
    class PlaybackProcessor {
        constructor(duration) {
            this.duration = duration;
            this.db = new streamer_db_1.default();
            setInterval(() => this.sweepInactive(), duration * 0.5);
        }
        createPlayback(url) {
            const added = this.db.insert([new streamer_1.default(url, this.duration)]);
            return added[0].start();
        }
        destroyPlayback(id) {
            const found = this.db.find([id]);
            return this.db.remove(found)[0].stop();
        }
        beatPlayback(id) {
            const found = this.db.find([id])[0];
            found.heartbeat();
            return found;
        }
        getRunningPlaybacks() {
            return this.db.find();
        }
        sweepInactive() {
            if (this.db.length < 1)
                return;
            const inactive = this.db.find().filter((replay) => !replay.is_active);
            if (inactive.length < 1)
                return;
            this.db.remove(inactive);
        }
    }
    exports.default = PlaybackProcessor;
});
