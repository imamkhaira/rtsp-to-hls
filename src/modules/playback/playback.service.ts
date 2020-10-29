import createResponse from '@/entities/response';
import PlaybackProcessor from './playback.processor';

export default class PlaybackServices {
    private processor: PlaybackProcessor;

    constructor(default_duration: number) {
        this.processor = new PlaybackProcessor(default_duration);
    }

    /** @param request array of urls to be live-streamed */
    public async start(request: string) {
        try {
            const stream = await this.processor.createPlayback(request);
            return createResponse(stream);
        } catch (e) {
            throw new Error('Error while starting playback');
        }
    }

    /** @param request array of livestream ids to be stopped */
    public async stop(request: string) {
        try {
            const stream = await this.processor.destroyPlayback(request);
            return createResponse(stream);
        } catch (e) {
            throw new Error('Error while starting playback');
        }
    }

    /** @param request array of livestream ids to be heartbeated */
    public beat(request: string) {
        try {
            const stream = this.processor.beatPlayback(request);
            return createResponse(stream);
        } catch (e) {
            throw new Error('Error while starting playback');
        }
    }

    public getRunning() {
        const all = this.processor
            .getRunningPlaybacks()
            .map((stream) => stream.info);
        return createResponse(all);
    }
}
