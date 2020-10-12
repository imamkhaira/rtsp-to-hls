import ShortUUID from 'short-uuid';
import { spawn } from 'child_process';
import { STREAM_KEEPALIVE_DURATION } from '@/config';

// test stream: rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream
// https://www.cyberciti.biz/tips/what-is-devshm-and-its-practical-usage.html
// ffmpeg -loglevel panic -rtsp_transport tcp -i $url -c:v libx264 -crf 21 -preset veryfast -g 25 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -f hls -hls_time 4 -hls_playlist_type event -hls_flags single_file /dev/shm/stream.m3u8

/**
 * test scenarios:
 * 1. start() -> stop() : can, duration n, -1
 * 2. start() -> heartbeat() -> stop() : can, duration n, n, -1
 * 3. start() -> stop() -> heartbeat() : cant, duration n, -1, -1
 */

const FILE_LOCATION = '/dev/shm';

export default class Stream {
    constructor(
        public name: string,
        public url: string,
        public duration = STREAM_KEEPALIVE_DURATION,
        private id = ShortUUID.generate(),
    ) {}
}
