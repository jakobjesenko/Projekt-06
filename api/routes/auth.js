import express from 'express';
import * as authController from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import usersCtrl from "../controllers/users.js";

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', authController.register);

// POST /api/auth/login
authRouter.post('/login', authController.login);

// POST /api/auth/logout
authRouter.post('/logout', authController.logout);

// GET /api/auth/verify-email
authRouter.get('/verify-email', authController.verifyEmail);

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password
authRouter.post('/reset-password', authController.resetPassword);

// POST /api/auth/resend-verification
authRouter.post('/resend-verification', authController.resendVerificationEmail);

// PUT /api/auth/profile/:userId
authRouter.put("/profile/:userId", usersCtrl.updateProfile);

// GET /api/auth/me
authRouter.get('/me', protect, (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
});

export default authRouter;
