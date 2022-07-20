import express from 'express';
<<<<<<< HEAD
import { WORK_DIRECTORY, OUTPUT_URL, PORT, STREAM_KEEPALIVE, RUNAS_UID } from './shared/config';
=======
import { WORK_DIRECTORY, OUTPUT_URL, PORT, STREAM_KEEPALIVE } from './shared/config';
>>>>>>> fix/docker-entrypoint
import { StaticModule } from './modules/static/static.module';
import { TranscoderModule } from './modules/transcoder/transcoder.module';

const App = express();

const [transcoder, refresher] = TranscoderModule({
    workDir: WORK_DIRECTORY,
    outputUrl: OUTPUT_URL,
<<<<<<< HEAD
    keepalive: STREAM_KEEPALIVE,
    userUid: RUNAS_UID
=======
    keepalive: STREAM_KEEPALIVE
>>>>>>> fix/docker-entrypoint
});

App.use('/transcode', transcoder);
App.use(OUTPUT_URL, refresher);
App.use(OUTPUT_URL, StaticModule(WORK_DIRECTORY));

App.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`server is listening on port ${PORT}`);
    console.log(`config:`, {
        workDir: WORK_DIRECTORY,
        outputUrl: OUTPUT_URL,
        keepalive: STREAM_KEEPALIVE,
        userUid: RUNAS_UID
    });
=======
    console.table({ WORK_DIRECTORY, OUTPUT_URL, PORT, STREAM_KEEPALIVE });
>>>>>>> fix/docker-entrypoint
});
