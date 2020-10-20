import Streamer from '@/entities/streamer';
import StreamerDB from '@/entities/streamer-db';

export default class PlaybackProcessor {
    private db: StreamerDB;

    constructor(public readonly duration: number) {
        this.db = new StreamerDB();
    }

    public async createPlayback(url: string) {
        const created = new Streamer(url, this.duration).start();
        return this.db.insert([await created]);
    }

    public async destroyPlayback(id: string) {
        const found = this.db.find([id]);
        const removed = (this.db.remove(found) as Streamer[]).map((replay) =>
            replay.stop(),
        );

        return Promise.all(removed);
    }
}
