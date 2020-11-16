const config = {
    api_port: Number(process.env.API_PORT) || 3000,
    api_address: process.env.API_ADDRESS || 'http://192.168.100.120:3000',
    api_root_url: process.env.API_ROOT_URL || '/api',
    hls_root_dir: process.env.HLS_ROOT_DIR || '/dev/shm/transcoder',
    hls_duration: Number(process.env.HLS_DURATION) || 20000
};

export default config;
