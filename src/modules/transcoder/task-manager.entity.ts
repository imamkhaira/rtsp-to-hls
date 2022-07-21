import { Manageable } from './types';

export class TaskManager<T extends Manageable> {
    private processes = [] as T[];

    constructor(public readonly scanInterval: number) {
        this.scan();
    }

    /** find a process by processId or sourceUrl */
    public getProcessById(id: string): T | undefined {
        return this.processes.find(p => p.id === id);
    }

    public getProcessbyParam(param: keyof T, value: T[keyof T]) {
        return this.processes.find(p => p[param] === value);
    }

    /** add a process to taskManager */
    public addProcess(manageable: T): T {
        const i = this.processes.push(manageable) - 1;
        return this.processes[i];
    }

    /** refresh a process given its ID */
    public refreshProcess(processId: string): T | undefined {
        const found = this.getProcessById(processId);

        if (found !== undefined) found.refresh();
        return found;
    }

    /** create a garbage collector job */
    private scan(): NodeJS.Timer {
        console.log(`scanning garbage every ${this.scanInterval} ms`);
        return setInterval(() => {
            this.processes = this.processes.filter(p => {
                if (p.isActive()) return true;
                p.stop();
                return false;
            });
        }, this.scanInterval);
    }
}
