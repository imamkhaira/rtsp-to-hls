import { EventEmitter } from "events";

declare module "node-rtsp-stream-es6" {
  export default class RTSPStream extends EventEmitter {
    public name: string;
    public url: string;
    public width: number;
    public height: number;
    public port: number;
    public stream: {} | undefined;
    public server: {} | undefined;
    public mpeg1Muxer: EventEmitter | undefined;

    constructor (paramObject: { name: string; url: string; port: number; });

    start(): void;

    stop(callback: any): void;
  }
}
