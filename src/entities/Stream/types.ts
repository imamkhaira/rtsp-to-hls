import RTSPStream from 'node-rtsp-stream-es6';

export interface StreamObject {
    id: string;
    name: string;
    url: string;
    port: number;
    ends: number;
    stream: RTSPStream;
};

export interface StreamRequest {
    name: string;
    url: string;
}

export interface StreamResponse {
    id: string;
    name: string;
    url: string;
    port: number;
    ends: number;
}