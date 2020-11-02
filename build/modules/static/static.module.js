"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticModule = void 0;
const express_1 = __importDefault(require("express"));
function StaticModule(outputDir) {
    const module = express_1.default.Router();
    module.use((req, res, next) => {
        return next();
    }, express_1.default.static(outputDir, { index: false }));
    return module;
}
exports.StaticModule = StaticModule;
