"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
class TaskManager {
    scanInterval;
    processes = [];
    constructor(scanInterval) {
        this.scanInterval = scanInterval;
        this.scan();
    }
    getProcessById(id) {
        return this.processes.find((p) => p.id === id);
    }
    getProcessbyParam(param, value) {
        return this.processes.find((p) => p[param] === value);
    }
    addProcess(manageable) {
        const i = this.processes.push(manageable) - 1;
        return this.processes[i];
    }
    refreshProcess(processId) {
        const found = this.getProcessById(processId);
        if (found !== undefined)
            found.refresh();
        return found;
    }
    scan() {
        console.log(`scanning garbage every ${this.scanInterval} ms`);
        return setInterval(() => {
            console.log(`scanning for garbage`);
            this.processes = this.processes.filter((p) => {
                if (p.isActive())
                    return true;
                p.stop();
                return false;
            });
        }, this.scanInterval);
    }
}
exports.TaskManager = TaskManager;
