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

    public find(ids = (null as unknown) as string[]): InstanceWithID[] {
        if (ids === null) return this.storage;

        const toReturn = [] as InstanceWithID[];
        ids.forEach((id) => {
            const index = this.storage.findIndex((item) => item.id === id);
            if (index > -1) toReturn.push(this.storage[index]);
        });

        return toReturn;
    }

    public insert(instances: InstanceWithID[]): InstanceWithID[] {
        const copyofInstances = instances;
        this.forEachMatchesOf(instances, (eh, oh, instanceIndex) => {
            copyofInstances.splice(instanceIndex);
        });
        this.storage.push(...copyofInstances);
        return copyofInstances;
    }

    public remove(instances: InstanceWithID[]): InstanceWithID[] {
        const toReturn = [] as InstanceWithID[];

        this.forEachMatchesOf(instances, (storageIndex) => {
            toReturn.push(...this.storage.splice(storageIndex, 1));
        });

        return toReturn;
    }

    public replace(instances: InstanceWithID[]): InstanceWithID[] {
        const toReturn = [] as InstanceWithID[];

        this.forEachMatchesOf(instances, (storageIndex, instance) => {
            toReturn.push((this.storage[storageIndex] = instance));
        });

        return toReturn;
    }

    public get length() {
        return this.storage.length;
    }

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
