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
    class LiveProcessor {
        constructor(duration) {
            this.duration = duration;
            this.db = new streamer_db_1.default();
            setInterval(() => this.sweepInactive(), duration * 0.7);
        }
        createLiveStreams(urls) {
            const created = urls.map((url) => new streamer_1.default(url, this.duration));
            const inserted = this.db.insert(created);
            const started = inserted.map((live) => live.start());
            return Promise.all(started);
        }
        destroyLiveStreams(ids) {
            const removed = this.db.remove(this.db.find(ids));
            const stopped = removed.map((live) => live.stop());
            return Promise.all(stopped);
        }
        beatLiveStreams(ids) {
            const found = this.db.find(ids);
            found.forEach((live) => live.heartbeat());
            return found;
        }
        getRunningLiveStreams() {
            return this.db.find();
        }
        sweepInactive() {
            if (this.db.length < 1)
                return;
            const inactive = this.db.find().filter((stream) => !stream.is_active);
            if (inactive.length < 1)
                return;
            this.db.remove(inactive);
        }
    }
    exports.default = LiveProcessor;
});
