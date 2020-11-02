var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "express", "./live.service", "@/shared/config", "@/middlewares/valid-rtsp"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = require("express");
    const live_service_1 = __importDefault(require("./live.service"));
    const config_1 = require("@/shared/config");
    const valid_rtsp_1 = __importDefault(require("@/middlewares/valid-rtsp"));
    const route = express_1.Router();
    const service = new live_service_1.default(config_1.STREAM_DURATION);
    route.post('/start', valid_rtsp_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const request_urls = req.body;
        const response = yield service.start(request_urls);
        res.end(response.to_json());
    }));
    route.post('/stop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const request_ids = req.body;
        const response = yield service.stop(request_ids);
        res.end(response.to_json());
    }));
    route.post('/heartbeat', (req, res) => {
        const request_ids = req.body;
        const response = service.beat(request_ids);
        res.end(response.to_json());
    });
    route.post('/all', (req, res) => {
        const response = service.getRunning();
        res.end(response.to_json());
    });
    exports.default = route;
});
