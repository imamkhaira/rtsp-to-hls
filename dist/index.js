var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@/shared/config", "@/server", "./shared/Logger"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const config_1 = require("@/shared/config");
    const server_1 = __importDefault(require("@/server"));
    const Logger_1 = __importDefault(require("./shared/Logger"));
    server_1.default.listen(config_1.API_PORT, () => {
        Logger_1.default.info(`
    listen port: ${config_1.API_PORT}
    output dir: ${config_1.STREAM_DIRECTORY}
    hls public path: ${config_1.STREAM_PUBLIC_PATH}
    stream duration: ${config_1.STREAM_DURATION}
    `);
    });
});
