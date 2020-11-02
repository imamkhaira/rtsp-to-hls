(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ValidateRTSP = (req, res, next) => {
        const rtsps = req.body;
        const found = rtsps.find((url) => !/rtsp:\/\/.*/.test(url));
        if (!found)
            next();
        else
            throw new Error(`You sent an invalid RTSP url!`);
    };
    exports.default = ValidateRTSP;
});
