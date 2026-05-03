import { Router } from "express";
import suggestionsCtrl from "../controllers/suggestions.js";

const suggestionsRouter = Router();

// GET /api/suggestions/:userId
suggestionsRouter.get("/:userId", suggestionsCtrl.generateSuggestions);

export default suggestionsRouter;
