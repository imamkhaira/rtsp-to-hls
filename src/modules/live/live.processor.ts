import Streamer from '@/entities/streamer';
import StreamerDB from '@/entities/streamer-db';
import { PerformanceObserver } from 'perf_hooks';

export default class LiveProcessor {
    private db: StreamerDB;

    constructor(public readonly duration: number) {
        this.db = new StreamerDB();
        setInterval(() => this.sweepInactive(), duration * 0.7);
    }

    public createLiveStreams(urls: string[]): Promise<Streamer[]> {
        const created = urls.map((url) => new Streamer(url, this.duration));
        const inserted = this.db.insert(created) as Streamer[];
        const started = inserted.map((live) => live.start());
        return Promise.all(started);
    }

    public destroyLiveStreams(ids: string[]): Promise<Streamer[]> {
        const removed = this.db.remove(this.db.find(ids)) as Streamer[];
        const stopped = removed.map((live) => live.stop());

        return Promise.all(stopped);
    }

    public beatLiveStreams(ids: string[]): Streamer[] {
        const found = this.db.find(ids) as Streamer[];
        found.forEach((live) => live.heartbeat());

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
