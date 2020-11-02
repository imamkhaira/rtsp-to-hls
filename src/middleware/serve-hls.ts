// import fs from 'fs-extra';
// import express from 'express';
// import Stream from '@/entities/Stream';

// /**
//  * Serve HLS files in dir as static asset in public_path.
//  * default to /dev/shm/node-transcoder and /hls
//  * @param dir physical location of transcoder output
//  * @param public_path virtual path where express should serve the files
//  */
// const serve_hls = (dir: string, public_path: string) => {
//     try {
//         Stream.root_directory = dir;
//         Stream = public_path;
//         fs.ensureDirSync(dir);
//         return express.static(dir);
//     } catch (err) {
//         throw new Error(
//             `Static stream directory ${dir} does not exist: ${
//                 err.message as string
//             }`,
//         );
//     }
// };

// export default serve_hls;
