import Restaurant from "../models/restaurants.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import { STATUS_CODE, USERTYPE, staticMessages, } from "../utils/constant.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getDashboard = async (req, res) => {
    try {
        const user = req.authUser;
        let dashboardData;
        switch (user.role) {
            case USERTYPE.ADMIN:
                dashboardData = await getAdminDashboard(user);
                break;
            case USERTYPE.RESTAURANT:
                dashboardData = await getRestaurantDashboard(user);
                break;
            case USERTYPE.USER:
                dashboardData = await getUserDashboard(user);
                break;
            default:
                return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse(STATUS_CODE.BAD_REQUEST, "Invalid user role")
                );
        }
        return res.status(STATUS_CODE.SUCCESS).json(successResponse(STATUS_CODE.SUCCESS, staticMessages.FOUND, { dashboard: dashboardData, }));
    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, staticMessages.INTERNAL_SERVER_ERROR));
    }
};

const getAdminDashboard = async (user) => {
    const totalUsers = await User.countDocuments({ role: USERTYPE.USER, });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const completedOrders = await Order.countDocuments({ status: "Completed" });
    const revenueResult = await Order.aggregate([
        {
            $match: {
                status: "Completed",
                isDeleted: { $ne: true },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const recentOrders = await Order.find()
        .populate("userId", "firstName lastName email")
        .populate("restaurantId", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return { role: USERTYPE.ADMIN, stats: { totalUsers, totalRestaurants, totalProducts, totalOrders, pendingOrders, completedOrders, totalRevenue, }, recentOrders };
};

const getRestaurantDashboard = async (user) => {
    const restaurant = await Restaurant.findOne({ owner: user._id }).lean();
    if (!restaurant) {
        return {
            role: USERTYPE.RESTAURANT,
            restaurant: null,
            stats: {
                totalProducts: 0,
                totalOrders: 0,
                pendingOrders: 0,
                completedOrders: 0,
                todayRevenue: 0,
            },
            recentOrders: [],
        };
    }
    const restaurantId = restaurant._id;
    const totalProducts = await Product.countDocuments({ restaurantId });
    const totalOrders = await Order.countDocuments({ restaurantId });
    const pendingOrders = await Order.countDocuments({
        restaurantId,
        status: "Pending"
    });
    const completedOrders = await Order.countDocuments({
        restaurantId,
        status: "Completed"
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const todayRevenueResult = await Order.aggregate([
        {
            $match: {
                restaurantId,
                status: "Completed",
                isDeleted: { $ne: true },

                createdAt: {
                    $gte: startOfToday,
                    $lte: endOfToday,
                },
            },
        },
        {
            $group: {
                _id: null,
                todayRevenue: {
                    $sum: "$totalAmount",
                },
            },
        },
    ]);
    const todayRevenue = todayRevenueResult[0]?.todayRevenue || 0;

    const recentOrders = await Order.find({ restaurantId }).populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return {
        role: USERTYPE.RESTAURANT,
        restaurant: {
            _id: restaurant._id,
            name: restaurant.name,
        },
        stats: {
            totalProducts,
            totalOrders,
            pendingOrders,
            completedOrders,
            todayRevenue,
        },
        recentOrders,
    };
};

const getUserDashboard = async (user) => {
    const myOrders = await Order.countDocuments({ userId: user._id });
    const pendingOrders = await Order.countDocuments({
        userId: user._id,
        status: "Pending"
    });

    const completedOrders = await Order.countDocuments({ userId: user._id, status: "Completed" });
    const cart = await Cart.findOne({ userId: user._id, }).lean();
    let cartItems = 0;

    if (cart?.items?.length) {
        cartItems = cart.items.reduce((total, item) => {
            return total + (item.quantity || 0);
        }, 0);
    }

    const recentOrders = await Order.find({ userId: user._id }).populate("restaurantId", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return {
        role: USERTYPE.USER,
        stats: {
            myOrders,
            pendingOrders,
            completedOrders,
            cartItems,
        },
        recentOrders,
    };
};