import fs from 'fs-extra';
import Stream from '@/entities/stream';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

describe(`Stream Entitiy`, function () {
    let test: Stream;

    beforeAll(() => {
        Stream.OUTPUT_DIRECTORY = '/dev/shm/jkw';
        Stream.PUBLIC_PATH = './public';
        test = new Stream('rtsp://192.168.100.150:554/ch08.264', 60000);
    });

    it(`creates the output folder`, function (done) {
        expect(fs.existsSync(Stream.OUTPUT_DIRECTORY)).toBeTrue();
        done();
    });

    it(`has id and url derived from Transcoder`, function (done) {
        expect(test.id).toBeDefined();
        expect(test.url).toBe('rtsp://192.168.100.150:554/ch08.264');
        done();
    });

    it(`is not active before it starts`, function (done) {
        expect(test.isActive).toBeFalse();
        done();
    });

    it(`creates index.m3u8 inside unique dir when started`, function (done) {
        expect(test.isActive).toBeFalse();

        test.start().then((started) => {
            expect(fs.existsSync(started.hls_dir + '/index.m3u8')).toBeTrue();
            done();
        });
    });

    it(`silently do nothing when started while it is still running`, function (done) {
        expect(test.isActive).toBeTrue();
        const id_now = test.id;
        test.start().then((started) => {
            expect(started.isActive).toBeTrue();
            expect(started.id).toEqual(id_now);
            done();
        });
    });

    it(`deletes the unique folder when stopped`, function (done) {
        expect(test.isActive).toBeTrue();
        test.stop().then((stopped) => {
            console.log(`testing ${stopped.hls_dir}, ${stopped.isActive}`);
            expect(fs.existsSync(stopped.hls_dir)).toBeFalse();
            done();
        });
    });

    it(`silently do nothing when stopped while it is already stopped`, function (done) {
        expect(test.isActive).toBeFalse();
        const id_now = test.id;
        test.stop().then((stopped) => {
            expect(stopped.isActive).toBeFalse();
            expect(stopped.id).toEqual(id_now);
            done();
        });
    });
});
