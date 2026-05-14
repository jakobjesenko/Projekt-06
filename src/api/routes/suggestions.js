import { Router } from "express";
import suggestionsCtrl from "../controllers/suggestions.js";
import { protect, restrictTo } from '../middleware/auth.js';

const suggestionsRouter = Router();

// GET /api/suggestions/config
suggestionsRouter.get(
	'/config',
	protect,
	restrictTo('admin'),
	suggestionsCtrl.getSuggestionConfig,
);

// PUT /api/suggestions/config
suggestionsRouter.put(
	'/config',
	protect,
	restrictTo('admin'),
	suggestionsCtrl.updateSuggestionConfig,
);

// GET /api/suggestions/:userId
suggestionsRouter.get("/:userId", suggestionsCtrl.generateSuggestions);

export default suggestionsRouter;
