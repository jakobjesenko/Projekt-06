// routes/hbs.js
import { Router } from "express";
const router = Router();
import ctrlLocations from "../controllers/locations.js";
import ctrlOther from "../controllers/other.js";

// View rute (vračajo HTML)
router.get("/", ctrlLocations.list);
router.get("/login", ctrlLocations.login);
router.get("/register", ctrlLocations.register);
router.get("/dashboard", ctrlLocations.dashboard);
router.get("/profile/edit", ctrlLocations.editProfile);
router.get("/admin", ctrlLocations.adminPanel);
router.get("/forgot-password", ctrlLocations.forgotPassword);

// Informacijske strani
router.get("/about", ctrlOther.about);
router.get("/contact", ctrlOther.contact);
router.get("/how-it-works", ctrlOther.howItWorks);
router.get("/faq", ctrlOther.faq);
router.get("/gdpr", ctrlOther.gdpr);
router.get("/terms", ctrlOther.terms);

// Klepet in ocenjevanje
router.get("/chat", ctrlOther.chat);
router.get("/rating", ctrlOther.rating);
router.get("/reset-password", ctrlOther.resetPassword);

// Stare rute (za kompatibilnost)
router.get("/location", ctrlLocations.dashboard);
router.get("/location/comment/new", ctrlLocations.dashboard);

export default router;