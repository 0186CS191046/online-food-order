
import config from "../config/index.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js"
import crypto from "crypto";
import { staticMessages, STATUS_CODE } from "../utils/constant.js";
import { errorResponse, successResponse } from "../utils/response.js";
import orderId from "../utils/orderId.js";
import Restaurant from "../models/restaurants.js";
import razorpayInstance from "../utils/razorpay.js";

export const createOrder = async (req, res) => {
    try {
        const { products, tax = 0, shipping = 0, amount, currency, restaurantId, paymentMethod } = req.body;
        const userId = req.authUser.id;
        if (!userId) {
            return res.status(STATUS_CODE.NOT_AUTHORIZED).json(errorResponse(STATUS_CODE.NOT_AUTHORIZED, staticMessages.NOT_AUTHORIZED));
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }
        if (amount == null || amount <= 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.VALID_AMOUNT));
        }

        if (!restaurantId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }
        const saveOrderId = orderId;

        const options = {
            amount: Math.round(Number(amount) * 100),  //convert to paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        };

        const finalAmount = Math.round(Number(amount) * 100);

        const razorpayOrder = await razorpayInstance.orders.create(options);

        const newOrder = await Order.create({
            razorpayOrderId: razorpayOrder.id,
            userId,
            orderId: saveOrderId,
            restaurantId,
            products,
            tax,
            shipping,
            amount,
            currency,
            status: "Pending",
            paymentMethod,
            paymentStatus: "Pending",
        });

        return res.status(STATUS_CODE.CREATED).json(successResponse(STATUS_CODE.CREATED, staticMessages.ORDER_CREATE, {order:newOrder}))

    } catch (error) {
        console.log("Error creating order:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        const userId = req.authUser.id;

        if (paymentFailed) {
            const order = await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { paymentStatus: "Failed" }, { new: true })
            return res.status(400).json({ success: false, message: "Payment Failed!", order })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", config.razorpay_api_secret).update(sign.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate({
                razorpayOrderId: razorpay_order_id
            },
                {
                    paymentStatus: "Paid", razorpayPaymentId: razorpay_payment_id,
                    status : "Confirmed",
                    razorpaySignature: razorpay_signature
                }, { new: true });
            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0 } });
            return res.status(200).json({ success: true, message: "Payment successfull!", order })
        } else {
            await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "Failed" }, { new: true });
            return res.status(400).json({ success: false, message: "Invalid SIgnature!" })
        }

    } catch (error) {
        console.log("Error verifying Payment :", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong!", error: error.message })
    }
};


export const getMyOrders = async (req, res) => {
    try {
        console.log("+++++++++++++++++");

        const userId = req.authUser.id;
        if (!userId) {
            return res.status(STATUS_CODE.NOT_AUTHORIZED).json(errorResponse(STATUS_CODE.NOT_AUTHORIZED, staticMessages.NOT_AUTHORIZED));
        }
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate({ path: "products.productId", select: "productName price productImg" })
            .populate({ path: "restaurantId", select: "restaurantName" })
            .populate({ path: "userId", select: "firstName lastName email" });

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { count: orders.length, orders }));
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.authUser?._id || req.authUser?.id;
        if (!userId) {
            return res.status(STATUS_CODE.NOT_AUTHORIZED).json(errorResponse(STATUS_CODE.NOT_AUTHORIZED, staticMessages.NOT_AUTHORIZED));
        }
        const order = await Order.findOne({ _id: orderId, userId })
            .populate({ path: "products.productId", select: "productName price productImg" })
            .populate({ path: "userId", select: "firstName lastName email" });
        if (!order) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { order }));
    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

// ========================================== // ADMIN: GET ORDERS OF A USER // ========================================== 
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate({ path: "products.productId", select: "productName price productImg" })
            .populate({ path: "userId", select: "firstName lastName email" });
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { count: orders.length, orders }));
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .select("_id orderId userId restaurantId products amount currency status createdAt")
            .populate({ path: "restaurantId", select: "restaurantName" })
            .populate({ path: "userId", select: "firstName lastName email" })
            // .populate({ path: "restaurantId", select: "restaurantName" })
            .populate({ path: "products._id", select: "productName price -_id" });

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { count: orders.length, orders }));

    } catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.authUser.id;
        if (!userId) {
            return res.status(STATUS_CODE.NOT_AUTHORIZED).json(errorResponse(STATUS_CODE.NOT_AUTHORIZED, staticMessages.NOT_AUTHORIZED));
        }
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }
        // Adjust these statuses according to your Order schema 
        const nonCancellableStatuses = ["Delivered", "Cancelled", "Out for Delivery"];
        if (nonCancellableStatuses.includes(order.status)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.ORDER_CANNOT_CANCEL));
        }
        order.status = "Cancelled";
        await order.save();
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.ORDER_CANCEL, { order }));
    } catch (error) {
        console.error("Error cancelling order:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.MISSING_REQUIRED_FIELDS));
        }
        const allowedStatuses = ["Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, staticMessages.INVALID_STATUS));
        }
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true })
            .populate({ path: "userId", select: "firstName lastName email" })
            .populate({ path: "products.productId", select: "productName price productImg" });

        if (!order) {
            return res.status(STATUS_CODE.NOT_FOUND).json(errorResponse(STATUS_CODE.NOT_FOUND, staticMessages.NOT_FOUND));
        }
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.ORDER_UPDATE, { order }));
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
}

export const getRestaurantOrders = async (req, res) => {
    try {
        const userId = req.authUser.id;
        const restaurants = await Restaurant.find({ owner:userId }).select("_id");
        console.log("restaurants",restaurants);
        
        if (!restaurants.length) {
            return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { orders: [] }));
        }
        const restaurantIds = restaurants.map((restaurant) => restaurant._id);
        console.log("restaurantIds",restaurantIds);
        
        const orders = await Order.find({ restaurantId: { $in: restaurantIds } })
            .sort({ createdAt: -1 }).select("_id orderId userId restaurantId products amount currency paymentStatus status createdAt")
            .populate({ path: "userId", select: "firstName lastName email" })
            .populate({ path: "products.productId", select: "productName price productImg" });

        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { orders }));
    } catch (error) {
        console.error("getRestaurantOrders error:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};
