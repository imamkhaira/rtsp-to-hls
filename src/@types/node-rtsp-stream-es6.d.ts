declare module "node-rtsp-stream-es6" {
  export default class RTSPStream {
    constructor (paramObject: { name: string; url: string; port: number; });

    start(): void;

    stop(cb: any): void;
  }
}
