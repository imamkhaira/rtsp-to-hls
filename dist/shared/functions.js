var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Logger"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRandomInt = exports.pErr = void 0;
    const Logger_1 = __importDefault(require("./Logger"));
    exports.pErr = (err) => {
        if (err) {
            Logger_1.default.err(err);
        }
    };
    exports.getRandomInt = () => {
        return Math.floor(Math.random() * 1000000000000);
    };
});
