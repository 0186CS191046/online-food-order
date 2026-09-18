import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import FiltersideBar from "@/components/FiltersideBar";
import Spinner from "../components/Spinner";
import { jwtDecode } from "jwt-decode";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const token = sessionStorage.getItem("token");
    const user = jwtDecode(token);

    const role = user.role
    const isAdmin = role === "Admin"
    const isRestaurant = role === "Restaurant"
    const isCustomer = !isAdmin && !isRestaurant;

    const getOrders = async () => {
        try {
            setLoading(true);
            let endpoint = "";
            if (isAdmin) {
                endpoint = "/api/v1/orders/admin/all";
            } else if (isRestaurant) {
                endpoint = "/api/v1/orders/restaurant";
            } else {
                endpoint = "/api/v1/orders/my-orders";
            }
            const res = await axios.get(
                `${import.meta.env.VITE_URL}${endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.data.success) {
                setOrders(res.data.orders || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, [role]);

    const getTotalItems = (products = []) => {
        return products.reduce((total, item) => total + Number(item.quantity || 0), 0);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
        const customerName = order.userId
            ? `${order.userId.firstName || ""} ${
                  order.userId.lastName || ""
              }`.trim()
            : "";

        const customerEmail = order.userId?.email || "";

        const restaurantName =
            order.restaurantId?.restaurantName || "";

        const orderId =
            order.orderId || order._id || "";

        // Search
        const matchesSearch =
            !searchValue ||
            orderId
                .toString()
                .toLowerCase()
                .includes(searchValue) ||
            customerName
                .toLowerCase()
                .includes(searchValue) ||
            customerEmail
                .toLowerCase()
                .includes(searchValue) ||
            restaurantName
                .toLowerCase()
                .includes(searchValue);

        // Status
        const matchesStatus =
            status === "all" ||
            status === "All" ||
            order.status === status;

        // Order date
        const orderDate = order.createdAt
            ? new Date(order.createdAt)
            : null;

        const matchedStartDate =
            !startDate ||
            (orderDate &&
                orderDate >= new Date(`${startDate}T00:00:00`));

        const matchedEndDate =
            !endDate ||
            (orderDate &&
                orderDate <= new Date(`${endDate}T23:59:59`));

        const matchedDate =
            matchedStartDate && matchedEndDate;

        return (
            matchesSearch &&
            matchesStatus &&
            matchedDate
        );
    });
}, [
    orders,
    search,
    status,
    startDate,
    endDate,
]);

    const handleCancelOrder = async (orderId) => {
        try {
            const confirmed = window.confirm("Are you sure you want to cancel this order?");
            if (!confirmed) return;

            const res = await axios.patch(
                `${import.meta.env.VITE_URL}/api/v1/orders/${orderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                getOrders();
            }
        } catch (error) {
            console.error("Error cancelling order:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Unable to cancel order.");
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_URL}/api/v1/orders/admin/${orderId}/status`, { status, },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setOrders((previousOrders) =>
                    previousOrders.map((order) =>
                        order._id === orderId ? { ...order, status, } : order)
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Unable to update order status.");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-700 bg-green-100";

            case "Cancelled":
                return "text-red-700 bg-red-100";

            case "Preparing":
                return "text-orange-700 bg-orange-100";

            case "Confirmed":
                return "text-blue-700 bg-blue-100";

            case "Ready":
                return "text-indigo-700 bg-indigo-100";

            case "Out for Delivery":
                return "text-purple-700 bg-purple-100";

            default:
                return "text-gray-700 bg-gray-100";
        }
    };

    const statusOptions = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    ];

    const renderTableHeaders = () => {
        if (isCustomer) {
            return (
                <>
                    <th className="px-6 py-4 text-left"> S No.</th>
                    <th className="px-6 py-4 text-left"> Order ID</th>
                    <th className="px-6 py-4 text-left">Restaurant </th>
                    <th className="px-6 py-4 text-left"> Items Count</th>
                    <th className="px-6 py-4 text-left"> Total Amount </th>
                    <th className="px-6 py-4 text-left">Payment Status</th>
                    <th className="px-6 py-4 text-left">Order Status</th>
                    <th className="px-6 py-4 text-left"> Order Date</th>
                    <th className="px-6 py-4 text-left"> Action</th>
                </>
            );
        }

        if (isRestaurant) {
            return (
                <>
                    <th className="px-6 py-4 text-left"> S No. </th>
                    <th className="px-6 py-4 text-left"> Order ID</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left"> Customer Email</th>
                    <th className="px-6 py-4 text-left"> Items Count</th>
                    <th className="px-6 py-4 text-left">Total Amount</th>
                    <th className="px-6 py-4 text-left">Payment Status </th>
                    <th className="px-6 py-4 text-left">Order Status </th>
                    <th className="px-6 py-4 text-left"> Order Date</th>
                    <th className="px-6 py-4 text-left">Action</th>
                </>
            );
        }

        return (
            <>
                <th className="px-6 py-4 text-left"> S No.</th>
                <th className="px-6 py-4 text-left"> Order ID  </th>
                <th className="px-6 py-4 text-left"> Customer</th>
                <th className="px-6 py-4 text-left"> Customer Email</th>
                <th className="px-6 py-4 text-left"> Restaurant</th>
                <th className="px-6 py-4 text-left"> Items Count</th>
                <th className="px-6 py-4 text-left"> Total Amount</th>
                <th className="px-6 py-4 text-left"> Payment Status </th>
                <th className="px-6 py-4 text-left"> Order Status </th>
                <th className="px-6 py-4 text-left"> Order Date </th>
                <th className="px-6 py-4 text-left"> Action </th>
            </>
        );
    };

    const renderOrderRow = (order, index) => {
        const customerName = order.userId ? `${order.userId.firstName || ""} ${order.userId.lastName || ""}`.trim() : "N/A";
        const customerEmail = order.userId?.email || "N/A";
        const restaurantName = order.restaurantId?.restaurantName || "N/A";
        const totalItems = getTotalItems(order.products);

        return (
            <tr key={order._id} className="border-b hover:bg-gray-50" >
                <td className="px-6 py-4"> {index + 1} </td>
                <td className="px-6 py-4 font-medium">
                    {order.orderId || order._id || "N/A"}
                </td>

                {isCustomer && (
                    <>
                        <td className="px-6 py-4"> {restaurantName} </td>
                        <td className="px-6 py-4"> {totalItems} </td>
                        <td className="px-6 py-4"> {order.currency || "INR"}{" "} {order.amount ?? "N/A"} </td>
                        <td className="px-6 py-4"> {order.paymentStatus || "N/A"} </td>
                        <td className="px-6 py-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${getStatusClass(order.status)}`}>
                                {order.status || "N/A"}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"> {formatDate(order.createdAt)} </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button title="View Order" className="text-blue-600 hover:text-blue-800">
                                    <Eye size={18} />
                                </button>
                                {!["Delivered", "Cancelled", "Out for Delivery",
                                ].includes(order.status) && (
                                        <button title="Cancel Order" onClick={() =>
                                            handleCancelOrder(order._id)}
                                            className="text-red-600 hover:text-red-800">
                                            <X size={18} />
                                        </button>
                                    )}
                            </div>
                        </td>
                    </>
                )}
                {isRestaurant && (
                    <>
                        <td className="px-6 py-4"> {customerName} </td>
                        <td className="px-6 py-4"> {customerEmail} </td>
                        <td className="px-6 py-4"> {totalItems} </td>
                        <td className="px-6 py-4"> {order.currency || "INR"}{" "} {order.amount ?? "N/A"} </td>
                        <td className="px-6 py-4"> {order.paymentStatus || "N/A"} </td>
                        <td className="px-6 py-4">
                            <select
                                value={order.status || "Pending"}
                                onChange={(e) =>
                                    handleStatusChange(order._id, e.target.value)}
                                className="border rounded px-2 py-1">
                                {statusOptions.map(
                                    (status) => (
                                        <option key={status} value={status}> {status} </option>
                                    )
                                )}
                            </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"> {formatDate(order.createdAt)} </td>
                        <td className="px-6 py-4">
                            <button title="View Order" className="text-blue-600 hover:text-blue-800">
                                <Eye size={18} />
                            </button>
                        </td>
                    </>
                )}

                {isAdmin && (
                    <>
                        <td className="px-6 py-4"> {customerName}  </td>
                        <td className="px-6 py-4"> {customerEmail} </td>
                        <td className="px-6 py-4"> {restaurantName} </td>
                        <td className="px-6 py-4"> {totalItems} </td>
                        <td className="px-6 py-4"> {order.currency || "INR"}{" "} {order.amount ?? "N/A"} </td>
                        <td className="px-6 py-4"> {order.paymentStatus || "N/A"} </td>
                        <td className="px-6 py-4">
                            <select
                                value={
                                    order.status ||
                                    "Pending"
                                }
                                onChange={(e) =>
                                    handleStatusChange(
                                        order._id,
                                        e.target.value
                                    )
                                }
                                className="border rounded px-2 py-1"
                            >
                                {statusOptions.map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    )
                                )}
                            </select>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(order.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                            <button
                                title="View Order"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <Eye size={18} />
                            </button>
                        </td>
                    </>
                )}
            </tr>
        );
    };


    // ==========================================
    // COLUMN COUNT
    // ==========================================

    const columnCount = isCustomer
        ? 9
        : isRestaurant
            ? 10
            : 11;

    return (
        <div className="min-h-screen">
            <div className="flex">


                {/* Main Content */}
                <div className="flex-1 min-w-0 p-4">

                    {/* Filter Sidebar */}
                    <FiltersideBar
                        type="orders"
                        search={search}
                        setSearch={setSearch}
                        status={status}
                        setStatus={setStatus}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />


                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            Orders
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {filteredOrders.length}{" "}
                            {filteredOrders.length === 1
                                ? "Order"
                                : "Orders"}
                        </p>
                    </div>


                    {/* Table */}
                    <div className="overflow-x-auto bg-white rounded-lg shadow">

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-[#CBCBCB] border-b">
                                    {renderTableHeaders()}
                                </tr>
                            </thead>


                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-6 py-10 text-center"
                                        >
                                            <Spinner />
                                        </td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map(
                                        renderOrderRow
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No Orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Order;

