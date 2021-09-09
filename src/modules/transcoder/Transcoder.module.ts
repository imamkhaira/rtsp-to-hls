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
        stream: stream,
    });
}

const moduleCors = cors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
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
export function TranscoderModule({
    workDir,
    outputUrl,
    keepalive,
    userUid,
}: TranscoderConfig) {
    const createStream = (sourceUrl: string): Stream =>
        new Stream({ sourceUrl, workDir, keepalive, userUid });
    //
    const taskManager = new TaskManager<Stream>(keepalive);
    const transcoder = express.Router();
    const refresher = express.Router();

    transcoder.use(moduleCors);
    refresher.use(moduleCors);
    transcoder.use(express.json());

    transcoder.post('', body('url').notEmpty(), async (req, res) => {
        try {
            const rtspUrl = req.body['url'] as string;
            if (!rtspUrl.includes('rtsp://'))
                throw new Error(`url is not defined`);

            let task = taskManager.getProcessbyParam('sourceUrl', rtspUrl);

            if (task === undefined) {
                const stream = await createStream(rtspUrl).start();
                task = taskManager.addProcess(stream);
            }

            return res
                .status(200)
                .end(
                    createResponse(
                        path.join(outputUrl, task.refresh().getIndex()),
                    ),
                );
        } catch (error) {
            return res.status(200).end(createResponse(null));
        }
    });

    refresher.use(
        '/:id/index.m3u8',
        param('id').notEmpty(),
        (req, res, next) => {
            const streamId = req.params?.id;
            if (streamId) taskManager.refreshProcess(streamId);
            return next();
        },
    );

    return [transcoder, refresher];
}

// http://localhost/output/oU2HiYbvJc97VeVVdCgVd6/index.m3u8
