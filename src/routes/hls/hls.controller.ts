import config from '@/shared/config';
import express from 'express';
import { transcoder_service } from '../transcode/transcode.controller';

const hls = express.Router();

hls.use('/:id/index.m3u8', (req, res, next) => {
    const stream_id = req.params[`id`];
    // eslint-disable-next-line no-console
    console.log(`refreshing ${stream_id}`);
    transcoder_service.refresh_stream(stream_id);
    next();
});

hls.use(express.static(config.hls_root_dir));

export default hls;
