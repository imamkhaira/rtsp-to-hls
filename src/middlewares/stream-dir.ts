import express from 'express';
import fs from 'fs-extra';

// the dir = /dev/shm/jokowi
export default (dir: string) => {
    try {
        fs.ensureDirSync(dir);
        return express.static(dir);
    } catch (err) {
        throw new Error(
            `Static stream directory ${dir} does not exist: ${err}`,
        );
    }
};
