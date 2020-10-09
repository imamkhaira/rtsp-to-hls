import Stream, { StreamRequest } from '@/entities/stream';
import { STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';

const streams = [] as Stream[];

export default class StreamProcessor {
    public static readonly MAX_PORTS = STREAM_MAX_PORT - STREAM_MIN_PORT;

    public getAvailablePorts(count: number): number[] {
        const usedPorts = streams.map(({ port }) => port);
        const getPort = (): number => {
            const newPort = Math.floor(
                Math.random() * (STREAM_MAX_PORT - STREAM_MIN_PORT) +
                    STREAM_MIN_PORT,
            );
            return usedPorts.includes(newPort) ? getPort() : newPort;
        };

        return [...Array(count).keys()].map(() => {
            const newPort = getPort();
            usedPorts.push(newPort);
            return newPort;
        });
    }

    public filterAvailable(req: StreamRequest[]): [StreamRequest[], boolean] {
        const avail = StreamProcessor.MAX_PORTS - streams.length;
        console.log(`available: ${avail}, reqs: ${req.length}`);

        if (avail < req.length) return [req.slice(0, Math.max(0, avail)), true];
        return [req, false];
    }
}
