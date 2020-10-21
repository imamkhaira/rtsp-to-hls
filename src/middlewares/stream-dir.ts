import fs from 'fs-extra';
import express from 'express';
import Streamer from '@/entities/streamer';

// the dir = /dev/shm/jokowi
export default (dir: string, public_path: string) => {
    try {
        Streamer.OUTPUT_DIRECTORY = dir;
        Streamer.PUBLIC_PATH = public_path;
        fs.ensureDirSync(dir);
        return express.static(dir);
    } catch (err) {
        throw new Error(
            `Static stream directory ${dir} does not exist: ${err}`,
        );
    }
};
