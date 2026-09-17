import { Router } from "express";
import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import productRoutes from "./productRoute.js";
import cartRoutes from "./cartRoute.js";
import orderRoutes from "./orderRoute.js";
import restaurantRoutes from "./restaurantRoute.js";
const router = Router();

router.use("/auth",authRoutes);
router.use("/user",userRoutes);
router.use("/product",productRoutes);
router.use("/cart",cartRoutes);
router.use("/order",orderRoutes);
router.use("/restaurant",restaurantRoutes);

export default router;