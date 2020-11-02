"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUNAS_UID = exports.STREAM_KEEPALIVE = exports.PORT = exports.OUTPUT_URL = exports.WORK_DIRECTORY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.WORK_DIRECTORY = String(process.env.WORK_DIRECTORY);
exports.OUTPUT_URL = String(process.env.OUTPUT_URL);
exports.PORT = Number(process.env.PORT);
exports.STREAM_KEEPALIVE = Number(process.env.STREAM_KEEPALIVE);
exports.RUNAS_UID = Number(process.env.RUNAS_UID);
