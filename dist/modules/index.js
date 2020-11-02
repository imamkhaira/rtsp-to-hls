var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "./live/live.controller", "./playback/playback.controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = require("express");
    const live_controller_1 = __importDefault(require("./live/live.controller"));
    const playback_controller_1 = __importDefault(require("./playback/playback.controller"));
    const router = express_1.Router();
    router.use('/livestream', live_controller_1.default);
    router.use('/playback', playback_controller_1.default);
    exports.default = router;
});
