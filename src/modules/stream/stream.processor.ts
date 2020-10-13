// import Stream, from '@/entities/stream';
// import { STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';

// const streams = [] as Stream[];

// export default class StreamProcessor {
//     public static readonly MAX_PORTS = STREAM_MAX_PORT - STREAM_MIN_PORT;

//     /** create an array of numbers that contains available port numbers */
//     private getAvailablePorts(count: number): number[] {
//         const usedPorts = streams.map(({ port }) => port);
//         const getPort = (): number => {
//             const newPort = Math.floor(
//                 Math.random() * (STREAM_MAX_PORT - STREAM_MIN_PORT) +
//                     STREAM_MIN_PORT,
//             );
//             return usedPorts.includes(newPort) ? getPort() : newPort;
//         };

//         return [...Array(count).keys()].map(() => {
//             const newPort = getPort();
//             usedPorts.push(newPort);
//             return newPort;
//         });
//     }

//     /** returns an array that contains [the filter result, and a true if it is filtered]  */
//     private filterAvailable(req: StreamRequest[]): [StreamRequest[], boolean] {
//         const avail = StreamProcessor.MAX_PORTS - streams.length;

//         if (avail < req.length) return [req.slice(0, Math.max(0, avail)), true];
//         return [req, false];
//     }

//     /** create a stream from an array of filtered requests */
//     public createStreams(requests: StreamRequest[]): Promise<Stream>[] {
//         const filtered = this.filterAvailable(requests);
//         const newports = this.getAvailablePorts(filtered[0].length);

//         const newstreams = filtered[0].map(
//             (req, i) => new Stream(req.name, req.url, newports[i]),
//         );
//         return newstreams.map((stream) => stream.start());
//     }

//     public stopStreams(ports: number[]): Promise<Stream>[] {
//         const found = streams.filter(({ port }) => ports.includes(port));
//         return found.map((stream) => stream.stop());
//     }

//     public beatStreams(ports: number[]): Promise<Stream>[] {
//         const found = streams.filter(({ port }) => ports.includes(port));
//         return found.map((stream) => stream.heartbeat());
//     }

//     private sweep(interval = 60000) {
//         return setInterval(() => {
//             if (streams.length > 0) {
//                 streams.filter((streams) => streams.duration > 0);
//             }
//         }, 60000);
//     }
// }
