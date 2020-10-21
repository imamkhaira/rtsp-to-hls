import createResponse from '@/entities/response';
import PlaybackProcessor from './playback.processor';

export default class PlaybackServices {
    private processor: PlaybackProcessor;

    constructor(default_duration: number) {
        this.processor = new PlaybackProcessor(default_duration);
    }

    /** @param request array of urls to be live-streamed */
    public async start(request: string): Promise<string> {
        try {
            const stream = await this.processor.createPlayback(request);
            return createResponse(stream.info);
        } catch (e) {
            return createResponse(
                request,
                true,
                'Error while starting playback',
                e.message,
            );
        }
    }

    /** @param request array of livestream ids to be stopped */
    public async stop(request: string): Promise<string> {
        try {
            const stream = await this.processor.destroyPlayback(request);
            return createResponse(stream.info);
        } catch (e) {
            return createResponse(
                request,
                true,
                'Error while stopping playback',
                e.message,
            );
        }
    }

    /** @param request array of livestream ids to be heartbeated */
    public beat(request: string): string {
        try {
            const stream = this.processor.beatPlayback(request);
            return createResponse(stream.info);
        } catch (e) {
            return createResponse(
                request,
                true,
                'Error while stopping playback',
                e.message,
            );
        }
    }
}
