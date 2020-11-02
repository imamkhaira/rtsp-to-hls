// import { Request} from 'express'
import create_response from '@/entities/APIResponse';
import TranscodeProcessor from './transcode.processor';

class TranscoderService {
    private readonly processor: TranscodeProcessor;

    constructor(
        private readonly hls_root_url: string,
        private readonly working_directory: string,
        private readonly stream_duration: number
    ) {
        this.processor = new TranscodeProcessor(this.working_directory, this.stream_duration);
    }

    public async create_stream(req: string) {
        const stream = await this.processor.create_stream(req);
        return create_response(stream.get_metadata(this.hls_root_url), 201, 'Created');
    }

    public refresh_stream(stream_id: string) {
        const stream = this.processor.refresh_stream(stream_id);
        return create_response(stream.get_metadata(this.hls_root_url));
    }

    public get_active_streams() {
        const streams = this.processor.get_active_streams();
        return create_response(streams.map(stream => stream.get_metadata(this.hls_root_url)));
    }
}

export default TranscoderService;
