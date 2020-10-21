import Response from '@/entities/response';
import PlaybackProcessor from './playback.processor';
import { streamer_to_response_data } from '@/shared/functions';

export default class PlaybackServices {
    private processor: PlaybackProcessor;

    constructor(default_duration: number) {
        this.processor = new PlaybackProcessor(default_duration);
    }

    /** @param request array of urls to be live-streamed */
    public async start(request: string) {
        try {
            const stream = await this.processor.createPlayback(request);
            return new Response(stream);
        } catch (e) {
            return new Response(
                request,
                true,
                'Error while starting playback',
                e.message,
            );
        }
    }

    /** @param request array of livestream ids to be stopped */
    public async stop(request: string) {
        try {
            const stream = await this.processor.destroyPlayback(request);
            return new Response(stream);
        } catch (e) {
            return new Response(
                request,
                true,
                'Error while stopping playback',
                e.message,
            );
        }
    }

    /** @param request array of livestream ids to be heartbeated */
    public beat(request: string) {
        try {
            const stream = this.processor.beatPlayback(request);
            return new Response(stream);
        } catch (e) {
            return new Response(
                request,
                true,
                'Error while stopping playback',
                e.message,
            );
        }
    }
}
