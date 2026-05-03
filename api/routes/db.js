import { Router } from 'express';
const router = Router();
import dbController from '../controllers/db.js';
import hardcodedSeedController from '../controllers/hardcoded-seed.js';
import { protect, restrictTo } from '../middleware/auth.js';

// POST /api/db/reset - Izbriši vse podatke
router.post('/reset', dbController.resetDatabase);

// POST /api/db/import - Uvozi random generirane podatke
router.post('/import', dbController.importData);

// POST /api/db/import-hardcoded - Uvozi hard-coded podatke
router.post('/import-hardcoded', hardcodedSeedController.importHardcodedData);

export default router;