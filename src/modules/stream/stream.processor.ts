import Stream from '@/entities/stream';
import StreamDB from '@/entities/stream-db';
import {
    STREAM_DIRECTORY,
    STREAM_PUBLIC_PATH,
    STREAM_DURATION,
} from '@/config';
import { stream } from 'winston';

Stream.OUTPUT_DIRECTORY = STREAM_DIRECTORY;
Stream.PUBLIC_PATH = STREAM_PUBLIC_PATH;

export interface StreamProcessorInstance {
    startStreams(urls: string[]): Promise<Stream[]>;
    stopStreams(ids: string[]): Promise<Stream[]>;
    beatStreams(ids: string[]): boolean[];

    readonly duration: number;
}

const active_streams = new StreamDB();

export class StreamProcessor implements StreamProcessorInstance {
    constructor(public readonly duration: number) {
        setInterval(() => this.purgeStopped(), 60000);
    }

    public async startStreams(urls: string[]): Promise<Stream[]> {
        const new_streams = urls.map((url) => new Stream(url, this.duration));
        const starting_streams = new_streams.map((stream) => stream.start());
        const started_streams = await Promise.all(starting_streams);

        return active_streams.insert(started_streams) as Stream[];
    }

    public async stopStreams(ids: string[]): Promise<Stream[]> {
        const to_stop = active_streams.find(ids) as Stream[];
        const stopping = to_stop.map((stream) => stream.stop());
        const stopped = await Promise.all(stopping);

        return active_streams.remove(stopped) as Stream[];
    }

    public beatStreams(ids: string[]) {
        const to_beat = active_streams.find(ids) as Stream[];
        const beated = to_beat.map((stream) => stream.heartbeat());
        return beated;
    }

    private purgeStopped() {
        if (active_streams.length < 1) return;

        const inactive = (active_streams.find() as Stream[]).filter(
            (streams) => !streams.isActive,
        );

        active_streams.remove(inactive);
    }
}
