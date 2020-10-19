import StreamDB from '@/entities/stream-db';

class DemoStream {
    constructor(public readonly id: string, public content: string) {}
}

describe(`Stream Database`, function () {
    let test: StreamDB;

    beforeAll(() => {
        test = new StreamDB();
    });

    it(`create empty storage initially`, function (done) {
        expect(test).toBeDefined();
        expect(test.length).toEqual(0);
        done();
    });

    it(`can insert items bilyat`, function (done) {
        expect(test).toBeDefined();

        const demo = [
            new DemoStream('1', 'jkw'),
            new DemoStream('2', 'jkw'),
            new DemoStream('3', 'jkw'),
            new DemoStream('4', 'jkw'),
        ];

        const inserted = test.insert(demo);

        expect(inserted).toBe(demo);
        done();
    });

    it(`can find items bilyat`, function (done) {
        expect(test).toBeDefined();

        const result = test.find(['1', '3']);
        expect(result[0].id).toBe('1');
        expect(result[1].id).toBe('3');
        done();
    });

    it(`can delete items bilyat`, function (done) {
        expect(test).toBeDefined();

        const result = test.find(['1', '3']);

        test.remove(result);
        expect(test.length).toEqual(2);
        expect(test.find(['1']).length).toBe(0);
        done();
    });

    it(`update like this`, function (done) {
        expect(test).toBeDefined();

        const result = test.find(['2']);
        result[0] = new DemoStream('1', 'updated');

        test.update(result);

        const newResult = test.find(['2']);
        expect(result[0].content).not.toBe(newResult[0].content);
        done();
    });
});
