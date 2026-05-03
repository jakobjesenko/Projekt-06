import { Router } from "express";
import usersCtrl from "../controllers/users.js";

const usersRouter = Router();

// GET /api/admin/users
usersRouter.get("/", usersCtrl.getAllUsers);

// PUT /api/admin/users/:userId/deactivate
usersRouter.put("/:userId/deactivate", usersCtrl.deactivateUser);

// PUT /api/admin/users/:userId/activate
usersRouter.put("/:userId/activate", usersCtrl.activateUser);

// PUT /api/auth/profile/:userId
usersRouter.put('/profile/:userId', usersCtrl.updateProfile);

// PUT /api/admin/users/activate-search/:userId
usersRouter.put('/activate-search/:userId', usersCtrl.activateSearch);

// PUT /api/admin/users/deactivate-search/:userId
usersRouter.put('/deactivate-search/:userId', usersCtrl.deactivateSearch);

export default usersRouter;
