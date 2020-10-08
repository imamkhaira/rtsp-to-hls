import { Router } from 'express';
import UserRouter from './stream/stream.controller';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/transcode', UserRouter);

// Export the base-router
export default router;
