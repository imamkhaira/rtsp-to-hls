import Response from '@/entities/response';

describe('Response Entity is working perfect', function () {
    const res = new Response('jokowi');

    it('works with single parameter', function () {
        expect(res.data).toBe('jokowi');
        expect(res.error).not.toBe(true);
        expect(res.more_info).toBe('');
    });

    it('can be stringified', function () {
        expect(res.json).toEqual(
            JSON.stringify({
                data: 'jokowi',
                error: false,
                message: 'OK',
                more_info: '',
            }),
        );
    });
});
