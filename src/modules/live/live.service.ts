import Response from '@/entities/response';
import Streamer from '@/entities/streamer';
import { stream } from 'winston';
import LiveProcessor from './live.processor';

export interface CreateLivestream {
    id: string;
    url: string;
    duration: number;
    public_index: string;
}

const createResponseFromStreamer = (streamer: Streamer) => ({
    id: streamer.id,
    url: streamer.url,
    duration: streamer.duration,
    public_index: streamer.public_index,
    heartbeat_url: `api/livestream/`,
});

export default class LiveServices {
    private processor = new LiveProcessor(60000);

    public async startLive(request: string[]) {
        this.processor.createLiveStreams(request);
    }
}
