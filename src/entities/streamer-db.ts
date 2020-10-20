export interface InstanceWithID extends Record<string, any> {
    id: string;
}

export interface StreamerDBInstance {
    find(ids: string[]): InstanceWithID[];
    insert(instances: InstanceWithID[]): InstanceWithID[];
    remove(instances: InstanceWithID[]): InstanceWithID[];
    replace(instances: InstanceWithID[]): InstanceWithID[];

    readonly length: number;
}

export default class StreamerDB implements StreamerDBInstance {
    private storage = [] as InstanceWithID[];

    /**
     * finds items by their IDs, accepts array of string ids and
     * return array of matching instances
     */
    public find(ids = (null as unknown) as string[]): InstanceWithID[] {
        if (ids === null) return this.storage;

        const toReturn = [] as InstanceWithID[];
        ids.forEach((id) => {
            const index = this.storage.findIndex((item) => item.id === id);
            if (index > -1) toReturn.push(this.storage[index]);
        });

        return toReturn;
    }

    /** insert array of instances into storage. returns inserted instances */
    public insert(instances: InstanceWithID[]): InstanceWithID[] {
        const pushed = [] as InstanceWithID[];
        instances.forEach((instance) => {
            pushed.push(this.storage[this.storage.push(instance) - 1]);
        });
        return pushed;
    }

    /**
     * remove array of instances with similiar IDs from storage.
     * returns removed instances
     */
    public remove(instances: InstanceWithID[]): InstanceWithID[] {
        const removed = [] as InstanceWithID[];

        this.forEachMatchesOf(instances, (storageIndex) => {
            removed.push(...this.storage.splice(storageIndex, 1));
        });

        return removed;
    }

    /**
     * replace instances with instances from an array with matchings IDs.
     * returns replaced instances
     */
    public replace(instances: InstanceWithID[]): InstanceWithID[] {
        const replaced = [] as InstanceWithID[];

        this.forEachMatchesOf(instances, (storageIndex, instance) => {
            replaced.push((this.storage[storageIndex] = instance));
        });

        return replaced;
    }

    /** get count of stored instances */
    public get length() {
        return this.storage.length;
    }

    /**
     * Perform callback actions for each item in instances
     * @param instances - array of instances
     * @param callback - action to fo for each instances
     */
    private forEachMatchesOf(
        instances: InstanceWithID[],
        callback: (
            index_in_storage: number,
            instance: InstanceWithID,
            instanceIndex: number,
        ) => void,
    ) {
        instances.forEach((instance, instanceIndex) => {
            const storageindex = this.storage.findIndex(
                (item) => item.id == instance.id,
            );
            if (storageindex > -1)
                void callback(storageindex, instance, instanceIndex);
        });
    }
}
