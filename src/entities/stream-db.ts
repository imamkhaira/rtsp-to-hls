export interface StreamLikeInstance extends Record<string, any> {
    id: string;
}

export interface StreamDBInstance {
    find(ids: string[]): StreamLikeInstance[];
    insert(instances: StreamLikeInstance[]): StreamLikeInstance[];
    remove(instances: StreamLikeInstance[]): StreamLikeInstance[];
    replace(instances: StreamLikeInstance[]): StreamLikeInstance[];

    readonly length: number;
}

export default class StreamDB implements StreamDBInstance {
    private storage = [] as StreamLikeInstance[];

    public find(ids = (null as unknown) as string[]): StreamLikeInstance[] {
        if (ids === null) return this.storage;

        const toReturn = [] as StreamLikeInstance[];
        ids.forEach((id) => {
            const index = this.storage.findIndex((item) => item.id === id);
            if (index > -1) toReturn.push(this.storage[index]);
        });

        return toReturn;
    }

    public insert(instances: StreamLikeInstance[]): StreamLikeInstance[] {
        const copyofInstances = instances;
        this.forEachMatchesOf(instances, (eh, oh, instanceIndex) => {
            copyofInstances.splice(instanceIndex);
        });
        this.storage.push(...copyofInstances);
        return copyofInstances;
    }

    public remove(instances: StreamLikeInstance[]): StreamLikeInstance[] {
        const toReturn = [] as StreamLikeInstance[];

        this.forEachMatchesOf(instances, (storageIndex) => {
            toReturn.push(...this.storage.splice(storageIndex, 1));
        });

        return toReturn;
    }

    public replace(instances: StreamLikeInstance[]): StreamLikeInstance[] {
        const toReturn = [] as StreamLikeInstance[];

        this.forEachMatchesOf(instances, (storageIndex, instance) => {
            toReturn.push((this.storage[storageIndex] = instance));
        });

        return toReturn;
    }

    public get length() {
        return this.storage.length;
    }

    private forEachMatchesOf(
        instances: StreamLikeInstance[],
        callback: (
            index_in_storage: number,
            instance: StreamLikeInstance,
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
