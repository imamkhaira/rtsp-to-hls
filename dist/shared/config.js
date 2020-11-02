var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "dotenv"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STREAM_DURATION = exports.STREAM_PUBLIC_PATH = exports.STREAM_DIRECTORY = exports.API_PUBLIC_PATH = exports.API_PORT = exports.SERVER_ADDRESS = void 0;
    const dotenv_1 = __importDefault(require("dotenv"));
    const environment = process.env.NODE_ENV || 'development';
    const result2 = dotenv_1.default.config({ path: `./env/${environment}.env` });
    if (result2.error)
        throw result2.error;
    exports.SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'http://192.168.100.198:3000';
    exports.API_PORT = Number(process.env.API_PORT || 3000);
    exports.API_PUBLIC_PATH = Number(process.env.API_PUBLIC_PATH || 3000);
    exports.STREAM_DIRECTORY = String(process.env.STREAM_DIRECTORY) || '/dev/shm';
    exports.STREAM_PUBLIC_PATH = String(process.env.STREAM_PUBLIC_PATH) || '/public';
    exports.STREAM_DURATION = Number(process.env.STREAM_DURATION || 300000);
});
