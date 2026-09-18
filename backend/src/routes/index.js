import { Router } from "express";
import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import productRoutes from "./productRoute.js";
import cartRoutes from "./cartRoute.js";
import orderRoutes from "./orderRoute.js";
import restaurantRoutes from "./restaurantRoute.js";
import dashboardRoutes from "./dashboardRoute.js"
const router = Router();

router.use("/auth",authRoutes);
router.use("/user",userRoutes);
router.use("/product",productRoutes);
router.use("/cart",cartRoutes);
router.use("/orders",orderRoutes);
router.use("/restaurant",restaurantRoutes);
router.use("/dashboard",dashboardRoutes);

export default router;