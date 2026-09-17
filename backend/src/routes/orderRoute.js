import express from "express";
import { isAuthenticate ,isAdmin, isUser} from "../middlewares/auth.js";
import { createOrder, getAllOrdersAdmin, getMyOrders, getSalesData, getUserOrders } from "../controllers/orderController.js";
const router = express.Router();

// For users
router.post("/", isAuthenticate, createOrder);
router.get("/",isAuthenticate,getMyOrders);

// For admin
router.get("/user-order/:userId",isAuthenticate,isAdmin,getUserOrders);
router.get("/all",isAuthenticate, isAdmin, getAllOrdersAdmin);
router.get("/sales-data",isAuthenticate,isAdmin,getSalesData);

export default router;