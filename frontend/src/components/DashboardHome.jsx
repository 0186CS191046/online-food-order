import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Users, Store, Package, ShoppingBag, IndianRupee, Clock, CheckCircle, ShoppingCart,
    Plus,ArrowRight } from "lucide-react";

const DashboardHome = () => {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getDashboard = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/dashboard`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setDashboardData(res.data.dashboard);
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error(error.response?.data?.message || "Failed to fetch dashboard" );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <p className="text-lg font-semibold text-gray-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    const role = dashboardData?.role?.toLowerCase();
    const stats = dashboardData?.stats || {};
    const recentOrders = dashboardData?.recentOrders || [];

    const adminStats = [
        {
            title: "Total Users",
            value: stats.totalUsers || 0,
            icon: Users,
        },
        {
            title: "Restaurants",
            value: stats.totalRestaurants || 0,
            icon: Store,
        },
        {
            title: "Products",
            value: stats.totalProducts || 0,
            icon: Package,
        },
        {
            title: "Total Orders",
            value: stats.totalOrders || 0,
            icon: ShoppingBag,
        },
        {
            title: "Total Revenue",
            value: `₹${stats.totalRevenue || 0}`,
            icon: IndianRupee,
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders || 0,
            icon: Clock,
        },
    ];

    const restaurantStats = [
        {
            title: "Total Products",
            value: stats.totalProducts || 0,
            icon: Package,
        },
        {
            title: "Total Orders",
            value: stats.totalOrders || 0,
            icon: ShoppingBag,
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders || 0,
            icon: Clock,
        },
        {
            title: "Completed Orders",
            value: stats.completedOrders || 0,
            icon: CheckCircle,
        },
        {
            title: "Today's Revenue",
            value: `₹${stats.todayRevenue || 0}`,
            icon: IndianRupee,
        },
    ];

    const userStats = [
        {
            title: "My Orders",
            value: stats.myOrders || 0,
            icon: ShoppingBag,
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders || 0,
            icon: Clock,
        },
        {
            title: "Completed Orders",
            value: stats.completedOrders || 0,
            icon: CheckCircle,
        },
        {
            title: "Cart Items",
            value: stats.cartItems || 0,
            icon: ShoppingCart,
        },
    ];

    let roleStats = [];

    if (role === "admin") {
        roleStats = adminStats;
    } else if (role === "restaurant") {
        roleStats = restaurantStats;
    } else {
        roleStats = userStats;
    }

    const getQuickActions = () => {
        if (role === "admin") {
            return [
                {
                    title: "Manage Users",
                    icon: Users,
                    path: "/dashboard/users",
                },
                {
                    title: "Manage Restaurants",
                    icon: Store,
                    path: "/dashboard/restaurants",
                },
                {
                    title: "Manage Products",
                    icon: Package,
                    path: "/dashboard/products",
                },
                {
                    title: "View Orders",
                    icon: ShoppingBag,
                    path: "/dashboard/orders",
                },
            ];
        }

        if (role === "restaurant") {
            return [
                {
                    title: "Add Product",
                    icon: Plus,
                    path: "/dashboard/add-product",
                },
                {
                    title: "Manage Products",
                    icon: Package,
                    path: "/dashboard/products",
                },
                {
                    title: "View Orders",
                    icon: ShoppingBag,
                    path: "/dashboard/orders",
                },
            ];
        }

        return [
            {
                title: "Browse Restaurants",
                icon: Store,
                path: "/dashboard/restaurants",
            },
            {
                title: "My Orders",
                icon: ShoppingBag,
                path: "/dashboard/orders",
            },
            {
                title: "View Cart",
                icon: ShoppingCart,
                path: "/cart",
            },
        ];
    };

    const quickActions = getQuickActions();
    const dashboardTitle = role === "admin" ? "Admin Dashboard": role === "restaurant"
                ? "Restaurant Dashboard" : "Customer Dashboard";

    const dashboardDescription =
        role === "admin" ? "Manage users, restaurants, products and orders."
            : role === "restaurant" ? "Manage your products and keep track of your orders."
                : "Browse restaurants, manage your cart and track your orders.";

    return (
        <div className="w-full pt-6">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900"> Dashboard </h1>
                <p className="text-gray-500 mt-2"> Welcome to your {role} dashboard. </p>

            </div>

            <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 ${
                    role === "admin" ? "lg:grid-cols-3" : "lg:grid-cols-4" }`} >

                {roleStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5" >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium"> {stat.title} </p>
                                    <h2 className="text-2xl font-bold mt-2"> {stat.value} </h2>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#6D8196] flex items-center justify-center">
                                    <Icon size={24} className="text-white"/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between p-5 border-b">
                        <div>
                            <h2 className="text-xl font-bold"> Recent Orders </h2>
                            <p className="text-sm text-gray-500 mt-1"> Latest order activity </p>
                        </div>
                        <button onClick={() => navigate("/dashboard/orders") }
                            className="flex items-center gap-1 text-[#6D8196] font-semibold cursor-pointer" >
                            View All
                            <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#CBCBCB]">
                                    <th className="px-5 py-4 text-left"> Order </th>
                                    <th className="px-5 py-4 text-left"> Customer </th>
                                    <th className="px-5 py-4 text-left"> Amount </th>
                                    <th className="px-5 py-4 text-left"> Status </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => {
                                        const customerName = order.userId
                                                ? `${order.userId.firstName || ""} ${order.userId.lastName || ""}`.trim()
                                                : "-";
                                        return (
                                            <tr
                                                key={order._id}
                                                className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="px-5 py-4 font-medium">
                                                    {order.orderId || order._id}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {customerName}
                                                </td>
                                                <td className="px-5 py-4">
                                                    ₹{order.totalAmount || 0}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                                                        {order.status || "-"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4"
                                            className="px-5 py-10 text-center text-gray-500">
                                            No recent orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h2 className="text-xl font-bold"> Quick Actions  </h2>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                        Quickly access important sections
                    </p>
                    <div className="space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button key={action.title}
                                    onClick={() =>
                                        navigate(action.path) }
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-[#6D8196] hover:text-white transition cursor-pointer group" >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#CBCBCB] group-hover:bg-white/20 flex items-center justify-center">
                                            <Icon size={20} />
                                        </div>
                                        <span className="font-semibold">
                                            {action.title}
                                        </span>
                                    </div>
                                    <ArrowRight size={18} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-[#6D8196] rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {dashboardTitle}
                        </h2>
                        <p className="text-gray-200 mt-1">
                            {dashboardDescription}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (role === "admin") {
                                navigate("/dashboard/orders");
                            } else if (role === "restaurant") {
                                navigate("/dashboard/products");
                            } else {
                                navigate("/dashboard/restaurants");
                            }
                        }}
                        className="bg-white text-gray-800 px-5 py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-100">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;