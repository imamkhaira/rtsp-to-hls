var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "http-status-codes", "@/entities/response", "@/shared/Logger"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const http_status_codes_1 = __importDefault(require("http-status-codes"));
    const response_1 = __importDefault(require("@/entities/response"));
    const Logger_1 = __importDefault(require("@/shared/Logger"));
    const StructuredError = (err, req, res, next) => {
        if (!err)
            next();
        Logger_1.default.err(err.message, true);
        res.status(http_status_codes_1.default.BAD_GATEWAY).end(response_1.default(null, true, err.message).to_json());
    };
    exports.default = StructuredError;
});
