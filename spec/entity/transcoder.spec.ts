import fs from 'fs-extra';
import { STREAM_DIRECTORY } from '@/config';
import Transcoder from '@/entities/transcoder';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
Transcoder.OUTPUT_DIRECTORY = '/dev/shm/bapak-kao';

describe('Transcoder Entity', function () {
    const ffmpeg = new Transcoder('rtsp://192.168.100.150:554/ch08.264');

    it(`creates ${Transcoder.OUTPUT_DIRECTORY} folder`, function (done) {
        expect(fs.existsSync(Transcoder.OUTPUT_DIRECTORY)).toBeTrue();
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
