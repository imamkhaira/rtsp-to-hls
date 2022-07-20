"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscoderModule = exports.createResponse = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_validator_1 = require("express-validator");
const stream_entity_1 = require("./stream.entity");
const task_manager_entity_1 = require("./task-manager.entity");
function createResponse(stream) {
    return JSON.stringify({
        error: stream === null ? true : false,
        stream: stream
    });
}
exports.createResponse = createResponse;
const moduleCors = (0, cors_1.default)({
    allowedHeaders: '*',
    origin: '*',
    methods: '*'
});
function TranscoderModule({ workDir, outputUrl, keepalive, userUid }) {
    const createStream = (sourceUrl) => new stream_entity_1.Stream({ sourceUrl, workDir, keepalive, userUid });
    const taskManager = new task_manager_entity_1.TaskManager(keepalive);
    const transcoder = express_1.default.Router();
    const refresher = express_1.default.Router();
    transcoder.use(moduleCors);
    refresher.use(moduleCors);
    transcoder.use(express_1.default.json());
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
    transcoder.post('', (0, express_validator_1.body)('url').notEmpty(), async (req, res) => {
        try {
            const rtspUrl = req.body['url'];
            if (!rtspUrl.includes('rtsp://'))
                throw new Error(`url is not defined`);
            let task = taskManager.getProcessbyParam('sourceUrl', rtspUrl);
            if (task === undefined) {
                const stream = await createStream(rtspUrl).start();
                task = taskManager.addProcess(stream);
            }
            const baseUrl = `${req.protocol}://${req.hostname}`;
            return res
                .status(200)
                .end(createResponse(baseUrl + path_1.default.join(outputUrl, task.refresh().getIndex())));
        }
        catch (error) {
            return res.status(200).end(createResponse(null));
        }
    });
    refresher.use('/:id/index.m3u8', (0, express_validator_1.param)('id').notEmpty(), (req, res, next) => {
        const streamId = req.params?.id;
        if (streamId)
            taskManager.refreshProcess(streamId);
        return next();
    });
    return [transcoder, refresher];
}
exports.TranscoderModule = TranscoderModule;
