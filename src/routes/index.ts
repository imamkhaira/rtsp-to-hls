import { Router } from 'express';
import transcode from './transcode/transcode.controller';
import hls from './hls/hls.controller';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/transcode', transcode);
router.use('/hls', hls);

// Export the base-router
export default router;
