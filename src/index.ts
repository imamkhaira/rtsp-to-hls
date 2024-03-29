import express from 'express';
import { WORK_DIRECTORY, OUTPUT_URL, PORT, STREAM_KEEPALIVE, RUNAS_UID } from './shared/config';
import { StaticModule } from './modules/static/static.module';
import { TranscoderModule } from './modules/transcoder/transcoder.module';
const App = express();

const [transcoder, refresher] = TranscoderModule({
    workDir: WORK_DIRECTORY,
    outputUrl: OUTPUT_URL,
    keepalive: STREAM_KEEPALIVE
});

App.use('/transcode', transcoder);
App.use(OUTPUT_URL, refresher);
App.use(OUTPUT_URL, StaticModule(WORK_DIRECTORY));

App.listen(PORT, () => {
    console.table({ WORK_DIRECTORY, OUTPUT_URL, PORT, STREAM_KEEPALIVE, RUNAS_UID });
});
