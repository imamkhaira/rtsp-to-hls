var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs-extra", "express", "@/entities/streamer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_extra_1 = __importDefault(require("fs-extra"));
    const express_1 = __importDefault(require("express"));
    const streamer_1 = __importDefault(require("@/entities/streamer"));
    const ServeHLS = (dir, public_path) => {
        try {
            streamer_1.default.OUTPUT_DIRECTORY = dir;
            streamer_1.default.PUBLIC_PATH = public_path;
            fs_extra_1.default.ensureDirSync(dir);
            return express_1.default.static(dir);
        }
        catch (err) {
            throw new Error(`Static stream directory ${dir} does not exist: ${err.message}`);
        }
    };
    exports.default = ServeHLS;
});
