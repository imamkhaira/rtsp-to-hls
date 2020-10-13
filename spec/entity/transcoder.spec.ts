import { STREAM_DIRECTORY } from '@/config';
import TranscoderGenerator from '@/entities/transcoder';
import logger from '@/shared/Logger';
import fs from 'fs-extra';

describe('Transcoder Entity', function () {
    const Transcoder = TranscoderGenerator(STREAM_DIRECTORY);
    const t123 = new Transcoder('t123', 'rtsp://192.168.100.150:554/ch08.264');

    it('creates a -jokowi- folder in -/dev/shm-', function () {
        expect(fs.existsSync(STREAM_DIRECTORY)).toBeTrue();
    });

    it('set -t123- as folder name if the stream id is -t123-', function () {
        const m3u8 = t123.m3u8;
        expect(m3u8).toEqual('/dev/shm/jokowi/t123/index.m3u8');
    });

    it('can activate ffmpeg process', function (done) {
        t123.start().then((pid) => {
            expect(pid).toBeGreaterThan(0);
            expect(t123.isActive).toBeTrue();
            // fs.existsSync(t123.hls_dir);
            done();
        });
    });
});
