import express from 'express';
import path from 'path';
import cors from 'cors';
import { body, param } from 'express-validator';
import { Stream } from './stream.entity';
import { TaskManager } from './task-manager.entity';

export interface TranscoderConfig {
    workDir: string;
    outputUrl: string;
    keepalive: number;
    userUid?: number;
}

/** create a standardized response string */
export function createResponse(stream: string | null): string {
    return JSON.stringify({
        error: stream === null ? true : false,
        stream: stream
    });
}

const moduleCors = cors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*'
});

//
//
//

/**
 * create an express Router that handles transcoding and refreshing tasks.
 * @param outputDir the directory to temporary store transcoded files
 * @param outputUrl the URL root where the files will be available.
 * @returns array of [transcoder, refresher]
 */
export function TranscoderModule({ workDir, outputUrl, keepalive, userUid }: TranscoderConfig) {
    const createStream = (sourceUrl: string): Stream =>
        new Stream({ sourceUrl, workDir, keepalive, userUid });
    //
    const taskManager = new TaskManager<Stream>(keepalive);
    const transcoder = express.Router();
    const refresher = express.Router();

    transcoder.use(moduleCors);
    refresher.use(moduleCors);
    transcoder.use(express.json());

    // prints greeting in html
    transcoder.get('', (req, res) => {
        const baseUrl = `${req.protocol}://${req.hostname}`;

        res.end(`
        <html>
            <head>
                <title>Transcoder is Accessible</title>
                <style>
                    .body, html {
                        color: white;
                        background-color: black;
                        font-family: "San Francisco", "Roboto", sans-serif;
                    }
                    </style>
            </head>
            <body>
                <h1>Transcoder is Accessible.</h1>
                <p>
                    If you can see this, transcoder API is working and accessible from outside.
                    Start by sending a POST request to this endpoint (${baseUrl}/transcode)
                    and include the following body:
                    </p>
                <pre>{ "url": "your RTSP stream" }</pre>
                <p>Do not forget to set the <pre>Content-Type</pre> header to <pre>application/json</pre> .</p>
                <p>Alles gute und viel Gluck!</p>
                <hr />
                <pre>imamkhaira/rtsp-to-hls v1.2.0</pre>
            </body>
        </html>
        `);
    });

    // process inqoming stream request
    transcoder.post('', body('url').notEmpty(), async (req, res) => {
        try {
            const rtspUrl = req.body['url'] as string;

            if (!rtspUrl.includes('rtsp://')) throw new Error(`url is not defined`);

            let task = taskManager.getProcessbyParam('sourceUrl', rtspUrl);

            if (task === undefined) {
                const stream = await createStream(rtspUrl).start();
                task = taskManager.addProcess(stream);
            }

            const baseUrl = `${req.protocol}://${req.hostname}`;
            return res
                .status(200)
                .end(createResponse(baseUrl + path.join(outputUrl, task.refresh().getIndex())));
        } catch (error) {
            return res.status(200).end(createResponse(null));
        }
    });

    // add a refresher middleware that will refresh a stream
    // whenever it is being viewed.
    refresher.use('/:id/index.m3u8', param('id').notEmpty(), (req, res, next) => {
        const streamId = req.params?.id;
        if (streamId) taskManager.refreshProcess(streamId);
        return next();
    });

    return [transcoder, refresher];
}
