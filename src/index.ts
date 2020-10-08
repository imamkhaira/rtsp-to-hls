import Express from 'express';
import { API_PORT } from '@/config';

const server = Express();

// Start the server
server.listen(API_PORT, () => {});
