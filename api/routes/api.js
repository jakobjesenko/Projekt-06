import { Router } from "express";
const router = Router();

import authCtrl from "../controllers/auth.js";
import usersCtrl from "../controllers/users.js";
import meetingsCtrl from "../controllers/meetings.js";
import ratingsCtrl from "../controllers/ratings.js";
import suggestionsCtrl from "../controllers/suggestions.js";

// Auth
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.post("/auth/forgot-password", authCtrl.forgotPassword);
router.put("/auth/profile/:userId", authCtrl.updateProfile);
router.put("/auth/activate-search/:userId", authCtrl.activateSearch);

// Admin - Users
router.get("/admin/users", usersCtrl.getAllUsers);
router.put("/admin/users/:userId/deactivate", usersCtrl.deactivateUser);
router.put("/admin/users/:userId/activate", usersCtrl.activateUser);

// Meetings
router.get("/meetings", meetingsCtrl.getAllMeetings);
router.post("/meetings", meetingsCtrl.createMeeting);
router.delete("/meetings/:meetingId", meetingsCtrl.deleteMeeting);
router.get("/meetings/confirmed/:userId", meetingsCtrl.getUserConfirmedMeetings);
router.post("/meetings/confirm", meetingsCtrl.confirmMeeting);
router.delete("/meetings/confirm/:meetingId", meetingsCtrl.cancelConfirmedMeeting);

// Ratings
router.get("/ratings", ratingsCtrl.getAllRatings);
router.post("/ratings", ratingsCtrl.createRating);
router.delete("/ratings/:ratingId", ratingsCtrl.deleteRating);

// Suggestions
router.get("/suggestions/:userId", suggestionsCtrl.generateSuggestions);

export default router;