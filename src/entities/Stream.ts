import { STREAM_MAX_PORT, STREAM_MIN_PORT } from '@/config';
import { StreamObject } from './types';
import RTSPStream from 'node-rtsp-stream-es6';

export class Stream {
  private streams: StreamObject[] = [];

  private createStream(source: string, name: string) {
    const portNumber = this.generateRandomPort();
    this.streams.push({
      port: portNumber,
      name,
      source,
      lastHeartBeat: Date.now(),
    });
    return portNumber;
  }

  private generateRandomPort() {
    const usedPort = this.streams.map(({ port }) => `${port}`);
    const createNewPort = (): number => {
      const newPort = Math.floor(
        Math.random() * STREAM_MAX_PORT + STREAM_MIN_PORT
      );
      return usedPort.includes(`${newPort}`) ? createNewPort() : newPort;
    };
    return createNewPort();
  }

  private startStream() {
    return 1;
  }
}
