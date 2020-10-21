import Streamer from '@/entities/streamer';
import StreamerDB from '@/entities/streamer-db';

export default class PlaybackProcessor {
    private readonly db: StreamerDB;

    constructor(public readonly duration: number) {
        this.db = new StreamerDB();
        setInterval(() => this.sweepInactive(), duration * 0.5);
    }

    public createPlayback(url: string): Promise<Streamer> {
        const added = this.db.insert([new Streamer(url, this.duration)]);

        return (added[0] as Streamer).start();
    }

    public destroyPlayback(id: string): Promise<Streamer> {
        const found = this.db.find([id]);

        return (this.db.remove(found)[0] as Streamer).stop();
    }

    public beatPlayback(id: string): Streamer {
        const found = this.db.find([id])[0] as Streamer;

        found.heartbeat();
        return found;
    }

    private sweepInactive() {
        if (this.db.length < 1) return;
        const inactive = (this.db.find() as Streamer[]).filter(
            (replay) => !replay.is_active,
        );

        if (inactive.length < 1) return;
        this.db.remove(inactive);
    }
}
