import express from "express";
import {  isAuthenticate } from "../middlewares/auth.js";
import { getDashboard} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/",isAuthenticate,getDashboard);

export default router;