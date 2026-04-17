import { Router } from 'express';
import ratingsCtrl from '../controllers/ratings.js';
import { protect, restrictTo } from '../middleware/auth.js';

const ratingsRouter = Router();

// GET /api/ratings
ratingsRouter.get('/', protect, restrictTo('admin'), ratingsCtrl.getAllRatings);

// POST /api/ratings
ratingsRouter.post('/', protect, restrictTo('admin', 'user'), ratingsCtrl.createRating);

// PUT /api/ratings/:ratingId
ratingsRouter.put('/:ratingId', protect, restrictTo('admin', 'user'), ratingsCtrl.updateRating);

// DELETE /api/ratings/:ratingId
ratingsRouter.delete(
	'/:ratingId',
	protect,
	restrictTo('admin', 'user'),
	ratingsCtrl.deleteRating,
);

export default ratingsRouter;
