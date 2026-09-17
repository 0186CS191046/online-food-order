
import config from "../config/index.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js"
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const {
            products,
            tax,
            shipping,
            amount,
            currency,
            restaurantId
        } = req.body;

        if (!products || products.length === 0 || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields!"
            });
        }

        const newOrder = await Order.create({
            userId: req.authUser.id,
            restaurantId,
            products,
            tax,
            shipping,
            amount,
            currency: currency || "INR",
            status: "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully!",
            order: newOrder
        });

    } catch (error) {
        console.log( "Error creating order:", error.message );
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
            error: error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.authUser._id;
        const orders = await Order.find({ userId }).populate({ path: "products.productId", select: "productName price productImg" })
            .populate("userId", "firstName lastName email")

        return res.status(200).json({ success: true, message: "Orders fetched successfully!", orders })
    } catch (error) {
        console.log("Error fetching user orders...", error);
        return res.status(500).json({ success: false, message: "Something went wrong!", error: error.message })
    }
};

// Admin Only
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).populate({ path: "products.productId", select: "productName price productImg" })
            .populate("userId", "firstName lastName email");

        return res.status(200).json({
            success: true, message: "Orders fetched successfully!",
            count: orders.length,
            orders
        })
    } catch (error) {
        console.log("Error fetching user orders...", error);
        return res.status(500).json({ success: false, message: "Something went wrong!", error: error.message })

    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
            .populate("user", "name email") //populate user info
            .populate("products.productId", "productName price productImg")  //populate product info

        return res.status(200).json({
            success: true, message: "Orders fetched successfully!",
            count: orders.length,
            orders
        });

    } catch (error) {
        console.log("Error fetching user orders...", error);
        return res.status(500).json({ success: false, message: "Something went wrong!", error: error.message })
    }
};

export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments({ status: "Paid" });

        // total sales amount
        const totalSalesAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalSales = totalSalesAgg[0]?.total || 0;

        // sales grouped by date (last 30 days)

        const lastTotalThirtyDays = new Date()
        lastTotalThirtyDays.setDate(lastTotalThirtyDays.getDate() - 30);

        const salesByData = await Order.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: lastTotalThirtyDays } } },
            {
                $group: {
                    _id:
                        { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const formattedSales = salesByData.map((item) => ({
            date: item._id,
            amount: item.amount
        }))

        return res.status(200).json({
            success: true, message: "Orders fetched successfully!",
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales: formattedSales
        });
    } catch (error) {
        console.log("Error fetching user orders...", error);
        return res.status(500).json({ success: false, message: "Something went wrong!", error: error.message })
    }
}