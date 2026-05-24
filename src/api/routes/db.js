import { Router } from 'express';
const router = Router();
import dbController from '../controllers/db.js';
import hardcodedSeedController from '../controllers/hardcoded-seed.js';
import { protect, restrictTo } from '../middleware/auth.js';

// POST /api/db/reset - Izbriši vse podatke
router.post('/reset', /*protect, restrictTo('admin'),*/ dbController.resetDatabase);

// POST /api/db/import - Uvozi random generirane podatke
router.post('/import', /*protect, restrictTo('admin'),*/ dbController.importData);

// POST /api/db/import-hardcoded - Uvozi hard-coded podatke
router.post('/import-hardcoded', /*protect, restrictTo('admin'),*/ hardcodedSeedController.importHardcodedData);

export default router;