import express from "express";
import { isAuthenticate, isAdmin, isUser, isRestaurantUser } from "../middlewares/auth.js";
import { cancelOrder, createOrder, getAllOrdersAdmin, getMyOrders, getOrderById, getUserOrders, updateOrderStatus, getRestaurantOrders, verifyPayment } from "../controllers/orderController.js";
const router = express.Router();

router.get("/restaurant", isAuthenticate, isRestaurantUser, getRestaurantOrders);
router.post("/", isAuthenticate, isUser, createOrder);
router.post("/payment/verify", isAuthenticate, verifyPayment);
router.get("/my-orders", isAuthenticate, isUser, getMyOrders);
router.get("/:orderId", isAuthenticate, getOrderById);
router.patch("/:orderId/cancel", isAuthenticate, isUser, cancelOrder);
router.get("/admin/all", isAuthenticate, isAdmin, getAllOrdersAdmin);
router.get("/admin/user/:userId", isAuthenticate, isAdmin, getUserOrders);
router.patch("/:orderId/status", isAuthenticate, isRestaurantUser, updateOrderStatus);

export default router;