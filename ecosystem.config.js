// server daemon configuration file
module.exports = {
    apps: [
        {
            name: 'Transcoder',
            script: './index.js',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
