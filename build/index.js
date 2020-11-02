"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./shared/config");
const static_module_1 = require("./modules/static/static.module");
const transcoder_module_1 = require("./modules/transcoder/transcoder.module");
const App = (0, express_1.default)();
const [transcoder, refresher] = (0, transcoder_module_1.TranscoderModule)({
    workDir: config_1.WORK_DIRECTORY,
    outputUrl: config_1.OUTPUT_URL,
    keepalive: config_1.STREAM_KEEPALIVE
});
App.use('/transcode', transcoder);
App.use(config_1.OUTPUT_URL, refresher);
App.use(config_1.OUTPUT_URL, (0, static_module_1.StaticModule)(config_1.WORK_DIRECTORY));
App.listen(config_1.PORT, () => {
    console.table({ WORK_DIRECTORY: config_1.WORK_DIRECTORY, OUTPUT_URL: config_1.OUTPUT_URL, PORT: config_1.PORT, STREAM_KEEPALIVE: config_1.STREAM_KEEPALIVE });
});
