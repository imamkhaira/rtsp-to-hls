import express from 'express';

/**
 * create a module to serve static files
 * @param outputDir absolute path to static file directory
 * @returns express.static module
 */
export function StaticModule(outputDir: string) {
    const module = express.Router();

    module.use((req, res, next) => {
        // do nothing for now.
        return next();
    }, express.static(outputDir, { index: false }));

    return module;
}
