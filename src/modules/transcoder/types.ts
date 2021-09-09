/**
 * adds the ability to be controlled by a status-based manager
 * uses isActive() method to determine whether the task should be killed or not.
 */
export interface Manageable {
    /** unique task identifier */
    readonly id: string;

    start(): Promise<Manageable>;

    /** stop the task */
    stop(): Promise<Manageable>;

    /** check if the task can be killed and removed */
    isActive(): boolean;

    /** extends the lifetime of the task */
    refresh(): Manageable;
}

//
//
//
