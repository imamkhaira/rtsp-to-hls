import express from 'express';
import fs from 'fs-extra';
import config from '@/shared/config';
import validate_rtsp from '@/middleware/validate-rtsp';

import TranscoderService from './transcode.service';

fs.emptyDirSync(config.hls_root_dir);

const transcode = express.Router();

export const transcoder_service = new TranscoderService(
    config.api_address + config.api_root_url + '/hls',
    config.hls_root_dir,
    config.hls_duration
);

transcode.get('/new', validate_rtsp, async (req, res) => {
    try {
        const rtsp_url = req.query[`url`] as string;

        const response = await transcoder_service.create_stream(rtsp_url);
        res.status(response.code).end(response.json);
    } catch (error) {
        throw new Error('The stream exist but cannot be transcoded');
    }
});

transcode.get('/all', (req, res) => {
    const response = transcoder_service.get_active_streams();
    res.status(response.code).end(response.json);
});

export default transcode;
