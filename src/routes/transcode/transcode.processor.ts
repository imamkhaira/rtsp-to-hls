import Stream from '@/entities/Stream';

const streams = [] as Stream[];

class TranscodeProcessor {
    /**
     * create a new Processor instance.
     * @param working_directory the directory to store HLS files
     * @param stream_duration time to keep the stream alive in miliseconds
     */
    constructor(readonly working_directory: string, readonly stream_duration: number) {}

    /** create new stream from supplied RTSP url */
    public create_stream(rtsp_url: string): Promise<Stream> {
        const found = streams.find(stream => stream.rtsp_url === rtsp_url);
        if (found && found.is_active) return Promise.resolve(found);

        const length = streams.push(
            new Stream(rtsp_url, this.stream_duration, this.working_directory)
        );
        return streams[length - 1].start();
    }

    /** refresh stream that mathced given stream ID */
    public refresh_stream(id: string): Stream {
        const found = streams.find(stream => stream.id === id);
        if (!found) throw new Error(`Cannot find stream with id ${id}.`);

        return found.refresh();
    }

    /** create new stream from supplied RTSP url */
    public get_active_streams(): Stream[] {
        return streams.filter(stream => stream.is_active);
    }
}

// automatically remove inactive streams from the array
setInterval(() => {
    if (streams.length === 0) return;
    streams.forEach((stream, index) => {
        if (stream.is_active) return;
        void streams.splice(index, 1);
    });
}, 60000);

export default TranscodeProcessor;
