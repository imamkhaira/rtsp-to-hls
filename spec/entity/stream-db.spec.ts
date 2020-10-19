import Stream from '@/entities/stream';
import StreamDB from '@/entities/stream-db';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
describe(`Stream DB with real Stream`, function () {
    let test: StreamDB;
    let ids: string[];

    beforeAll(() => {
        test = new StreamDB();
    });

    afterAll(() => {
        (test.find(ids) as Stream[]).forEach((stream) => stream.stop());
    });

    it(`can insert unstarted streams`, function (done) {
        expect(test).toBeDefined();

        const newStreams = [
            new Stream('rtsp://192.168.100.150:554/ch09.264', 30000),
            new Stream('rtsp://192.168.100.150:554/ch09.264', 30000),
            new Stream('rtsp://192.168.100.150:554/ch09.264', 30000),
            new Stream('rtsp://192.168.100.150:554/ch09.264', 30000),
        ];

        const streams = test.insert(newStreams);
        ids = streams.map((stream) => stream.id);
        expect(streams.length).toBe(test.length);
        done();
    });

    it(`can start unstarted stream`, function (done) {
        expect(test).toBeDefined();
        expect(ids.length).toBe(4);

        const starting = (test.find(ids) as Stream[]).map((streams) =>
            streams.start(),
        );
        Promise.all(starting).then((starteds) => {
            expect(starteds[0].isActive).toBeTrue();
            expect(starteds[1].isActive).toBeTrue();
            expect(starteds[2].isActive).toBeTrue();
            expect(starteds[3].isActive).toBeTrue();

            done();
        });
    });

    it(`has no consequences`, function (done) {
        expect(test).toBeDefined();
        expect(ids.length).toBe(4);

        const newfound = test.find(ids) as Stream[];

        expect(newfound[0].isActive).toBeTrue();
        expect(newfound[1].isActive).toBeTrue();
        expect(newfound[2].isActive).toBeTrue();
        expect(newfound[3].isActive).toBeTrue();
        done();
    });

    it(`can also stop unstopped streams`, function (done) {
        expect(test).toBeDefined();
        expect(ids.length).toBe(4);

        const newfound = test.find(ids) as Stream[];
        const stopping = newfound.map((stream) => stream.stop());

        Promise.all(stopping).then((stopped) => {
            const refound = test.find(ids) as Stream[];
            expect(refound[0].isActive).toBeFalse();
            expect(refound[1].isActive).toBeFalse();
            expect(refound[2].isActive).toBeFalse();
            expect(refound[3].isActive).toBeFalse();
            done();
        });
    });
});
