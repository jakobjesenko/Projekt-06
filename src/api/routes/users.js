import { Router } from "express";
import usersCtrl from "../controllers/users.js";
import { protect } from "../middleware/auth.js";

const usersRouter = Router();

// --- Admin routes ---

// GET /api/users/admin
usersRouter.get("/admin", usersCtrl.getAllUsers);

// PUT /api/users/admin/:userId/deactivate
usersRouter.put("/admin/:userId/deactivate", usersCtrl.deactivateUser);

// PUT /api/users/admin/:userId/activate
usersRouter.put("/admin/:userId/activate", usersCtrl.activateUser);

// PUT /api/users/admin/activate-search/:userId
usersRouter.put('/admin/activate-search/:userId', protect, usersCtrl.activateSearch);

// PUT /api/users/admin/deactivate-search/:userId
usersRouter.put('/admin/deactivate-search/:userId', protect, usersCtrl.deactivateSearch);

// POST /api/users/admin/strikes/:userId
usersRouter.post('/admin/strikes/:userId', usersCtrl.addStrike);

// GET /api/users/admin/strikes/:userId
usersRouter.get('/admin/strikes/:userId', usersCtrl.getUserStrikes);

// PUT /api/users/admin/strikes/:userId
usersRouter.put('/admin/strikes/:userId', usersCtrl.updateStrikes);

// PUT /api/users/admin/status/:userId
usersRouter.put('/admin/status/:userId', usersCtrl.updateUserStatus);


// --- User routes ---

// PUT /api/users/profile/:userId
usersRouter.put('/profile/:userId', usersCtrl.updateProfile);

export default usersRouter;
