/**
 * create typing for the untyped node-rtsp-stream-es6
 * please refer on complete types on
 * https://github.com/Wifsimster/node-rtsp-stream-es6/blob/master/src/videoStream.js
 */

declare module 'node-rtsp-stream-es6' {
    import { EventEmitter } from 'events';
    export default class RTSPStream extends EventEmitter {
        public name: string;
        public url: string;
        public width: number;
        public height: number;
        public port: number;
        public stream: {} | undefined;
        public server: {} | undefined;
        public mpeg1Muxer: EventEmitter | undefined;

        constructor(paramObject: { name: string; url: string; port: number });

        start(): void;

        stop(callback: any): void;
    }
}
