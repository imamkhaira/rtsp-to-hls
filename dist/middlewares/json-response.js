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
    const JSONResponse = (req, res, next) => {
        res.set('Content-Type', 'application/json');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('X-Content-Type-Options', 'nosniff');
        next();
    };
    exports.default = JSONResponse;
});
