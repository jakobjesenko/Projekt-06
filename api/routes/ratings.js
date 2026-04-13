import { Router } from "express";
import ratingsCtrl from "../controllers/ratings.js";

const ratingsRouter = Router();

// GET /api/ratings
ratingsRouter.get("/", ratingsCtrl.getAllRatings);

// POST /api/ratings
ratingsRouter.post("/", ratingsCtrl.createRating);

// DELETE /api/ratings/:ratingId
ratingsRouter.delete("/:ratingId", ratingsCtrl.deleteRating);

export default ratingsRouter;
