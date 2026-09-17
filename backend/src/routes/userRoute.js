import express from "express";
import {  getAllUsers, getUserById, updateUser, getSelfUser } from "../controllers/userController.js";
import { isAdmin, isAuthenticate,isUser,validateRefreshToken } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { validate } from "../middlewares/validate.js";
import { putUser } from "../validators/userValidator.js";
const router = express.Router();


router.get("/all",isAuthenticate, isAdmin, getAllUsers);
router.get("/:id", isAuthenticate, isAdmin, getUserById);
router.get("/", isAuthenticate, getSelfUser);
router.put("/", validate(putUser) , isAuthenticate, updateUser);

export default router;
