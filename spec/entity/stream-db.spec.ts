import Stream from '@/entities/stream';
import StreamDB from '@/entities/stream-db';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
describe(`Stream DB with real Stream`, function () {
    let test: StreamDB;

    beforeAll(() => {
        test = new StreamDB();
    });

    it(`can insert streams`, function (done) {
        expect(test).toBeDefined();

        const newStreams = [
            new Stream(
                'rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream',
                60000,
            ),
            new Stream(
                'rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream',
                60000,
            ),
            new Stream(
                'rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream',
                60000,
            ),
            new Stream(
                'rtsp://freja.hiof.no:1935/rtplive/_definst_/hessdalen03.stream',
                60000,
            ),
        ].map((stream) => stream.start());

        Promise.all(newStreams).then((streams) => {
            test.insert(streams);
            expect(test.length).toBe(newStreams.length);
            done();
        });
    });
});
