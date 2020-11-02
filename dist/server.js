var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "morgan", "helmet", "cookie-parser", "express-async-errors", "@/modules", "@/middlewares/serve-hls", "@/middlewares/json-response", "@/middlewares/structured-error", "@/shared/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const morgan_1 = __importDefault(require("morgan"));
    const helmet_1 = __importDefault(require("helmet"));
    const cookie_parser_1 = __importDefault(require("cookie-parser"));
    require("express-async-errors");
    const modules_1 = __importDefault(require("@/modules"));
    const serve_hls_1 = __importDefault(require("@/middlewares/serve-hls"));
    const json_response_1 = __importDefault(require("@/middlewares/json-response"));
    const structured_error_1 = __importDefault(require("@/middlewares/structured-error"));
    const config_1 = require("@/shared/config");
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(cookie_parser_1.default());
    if (process.env.NODE_ENV === 'production')
        app.use(helmet_1.default());
    else
        app.use(morgan_1.default('dev'));
    const full_path = config_1.SERVER_ADDRESS + config_1.STREAM_PUBLIC_PATH;
    app.use(config_1.STREAM_PUBLIC_PATH, serve_hls_1.default(config_1.STREAM_DIRECTORY, full_path));
    app.use('/api', json_response_1.default, modules_1.default);
    app.use(structured_error_1.default);
    exports.default = app;
});
