import { Router } from 'express';
import LiveModule from './live/live.controller';
import PlaybackModule from './playback/playback.controller';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/livestream', LiveModule);
router.use('/playback', PlaybackModule);

// Export the base-router
export default router;
