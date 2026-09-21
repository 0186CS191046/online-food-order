import express from "express";
import { isAuthenticate, validateRefreshToken } from "../middlewares/auth.js";
import {validate} from "../middlewares/validate.js";
import { userCreate, signIn  } from "../validators/authValidator.js";
import { adminCreate, register, login, logout, getAccessToken, resetPassword, forgotPassword, changedPassword } from "../controllers/authController.js";
const router = express.Router();


router.post("/register",validate(userCreate), register);
router.post("/admin", validate(userCreate), adminCreate);
router.post("/login",validate(signIn) , login);
router.post("/logout", isAuthenticate, logout);
router.get("/access-token", validateRefreshToken, getAccessToken);
router.patch("/change-password" , isAuthenticate, changedPassword);
router.post("/reset-password" , resetPassword);
router.post("/forgot-password", forgotPassword);

export default router;