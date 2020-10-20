import Streamer from '@/entities/streamer';
import StreamerDB from '@/entities/streamer-db';

export default class LiveProcessor {
    private db: StreamerDB;

    constructor(public readonly duration: number) {
        this.db = new StreamerDB();
        setInterval(() => this.sweepInactive(), duration * 2);
    }

    public async createLiveStreams(urls: string[]): Promise<Streamer[]> {
        const created = urls.map((url) =>
            new Streamer(url, this.duration).start(),
        );

        const started = await Promise.all(created);
        return this.db.insert(started) as Streamer[];
    }

    public async destroyLiveStreams(ids: string[]): Promise<Streamer[]> {
        const found = this.db.remove(this.db.find(ids)) as Streamer[];

        return await Promise.all(found.map((stream) => stream.stop()));
    }

    public beatLiveStreams(ids: string[]): Streamer[] {
        const found = (this.db.find(ids) as Streamer[]).map((stream) => {
            stream.heartbeat();
            return stream;
        });

        return found;
    }

    private sweepInactive() {
        if (this.db.length < 1) return;

        const inactive = (this.db.find() as Streamer[]).filter(
            (stream) => !stream.isActive,
        );

        if (inactive.length < 1) return;
        this.db.remove(inactive);
    }
}
