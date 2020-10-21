import { streamer_to_response_data } from '@/shared/functions';
import Response from '@/entities/response';
import LiveProcessor from './live.processor';

export default class LiveServices {
    private processor: LiveProcessor;

    constructor(default_duration: number) {
        this.processor = new LiveProcessor(default_duration);
    }

    /** @param request array of urls to be live-streamed */
    public async start(request: string[]) {
        try {
            const streams = await this.processor.createLiveStreams(request);
            return new Response(streams);
        } catch (e) {
            return new Response(
                request,
                true,
                'Error while starting livestream',
                e.message,
            );
        }
    }

    /** @param request array of livestream ids to be stopped */
    public async stop(request: string[]) {
        try {
            const streams = await this.processor.destroyLiveStreams(request);
            return new Response(streams);
        } catch (e) {
            return new Response(
                request,
                true,
                'Error while stopping livestream',
                e.message,
            );
        }
    }

    /** @param request array of livestream ids to be heartbeated */
    public beat(request: string[]) {
        try {
            const streams = this.processor.beatLiveStreams(request);
            return new Response(streams);
        } catch (e) {
            return new Response(
                request,
                true,
                'Error while stopping livestream',
                e.message,
            );
        }
    }
}
