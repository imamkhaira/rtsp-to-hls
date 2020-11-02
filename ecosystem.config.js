// pm2 config file
const config = {
    apps: [
        {
            name: 'transcoder',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production'
            },
            env_development: {
                NODE_ENV: 'development'
            },
            env_test: {
                NODE_ENV: 'test'
            }
        }
    ]
};

module.exports = config;
