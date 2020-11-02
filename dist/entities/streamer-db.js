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
    class StreamerDB {
        constructor() {
            this.storage = [];
        }
        find(keywords = null) {
            if (keywords === null)
                return this.storage;
            const toReturn = [];
            keywords.forEach((keyword) => {
                const index = this.storage.findIndex((item) => item.id === keyword);
                if (index > -1)
                    toReturn.push(this.storage[index]);
            });
            return toReturn;
        }
        insert(instances) {
            this.storage.push(...instances);
            return instances;
        }
        remove(instances) {
            const removed = [];
            this.forEachMatchesOf(instances, (storageIndex) => {
                removed.push(...this.storage.splice(storageIndex, 1));
            });
            return removed;
        }
        replace(instances) {
            const replaced = [];
            this.forEachMatchesOf(instances, (storageIndex, instance) => {
                replaced.push((this.storage[storageIndex] = instance));
            });
            return replaced;
        }
        get length() {
            return this.storage.length;
        }
        forEachMatchesOf(instances, callback) {
            instances.forEach((instance, instanceIndex) => {
                const storageindex = this.storage.findIndex((item) => item.id == instance.id);
                if (storageindex > -1)
                    void callback(storageindex, instance, instanceIndex);
            });
        }
    }
    exports.default = StreamerDB;
});
