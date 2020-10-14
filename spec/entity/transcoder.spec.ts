import fs from 'fs-extra';
import { generate } from 'short-uuid';
import { performance } from 'perf_hooks';
import logger from '@/shared/Logger';
import { STREAM_DIRECTORY } from '@/config';
import Transcoder from '@/entities/transcoder';
import { constants } from 'crypto';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
Transcoder.TRANSCODER_DIRECTORY = STREAM_DIRECTORY;

describe('Transcoder Entity', function () {
    const ffmpeg = new Transcoder('rtsp://192.168.100.150:554/ch08.264');

    it(`creates ${STREAM_DIRECTORY} folder`, function (done) {
        expect(fs.existsSync(STREAM_DIRECTORY)).toBeTrue();
        done();
    });

    it(`starts properly`, function (done) {
        ffmpeg.start().then((started) => {
            expect(started.pid).toBeGreaterThan(0);
            done();
        });
    });

    it(`creates index.m3u8 file inside its unique directory`, function (done) {
        expect(fs.existsSync(ffmpeg.hls_dir + '/index.m3u8')).toBeTrue();
        done();
    });

    it(`removes its working directory when stopped`, function (done) {
        ffmpeg.stop().then((stopped) => {
            expect(fs.existsSync(stopped.hls_dir + '/index.m3u8')).toBeFalse();
            done();
        });
    });
});
