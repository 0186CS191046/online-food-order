import Spinner from "@/components/Spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.data.success) {
                    setOrders(res.data.orders)
                    toast.success(res.data.message)
                }
            } catch (error) {
                console.log("Error fetching orders...", error);
                toast.error("Error fetching orders...")
            }
            finally {
                setLoading(false)
            }
        };

        fetchOrders()
    }, [token]);

    if (loading) {
        return (<Spinner/>)
    }else{
    return (
        <div className="py-20 mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Admin - All Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">No Orders found!</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-left text-sm">
                        <thead className="text-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Order Id</th>
                                <th className="px-4 py-2 border">User</th>
                                <th className="px-4 py-2 border">Products</th>
                                <th className="px-4 py-2 border">Amount</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border">{order._id}</td>
                                        <td className="px-4 py-2 border">{order?.userId?.firstName} {order?.userId?.lastName}<br />
                                            <span className="text-xs text-gray-500">{order?.userId?.email}</span>
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {order.products.map((p, idx) => (
                                                <div key={idx} className="text-sm line-clamp-2 m-2">
                                                    {p.productId.productName} x {p.quantity}
                                                </div>
                                            ))}
                                        </td>

                                        <td className="px-4 py-2 border font-semibold">
                                            ₹{order.amount.toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-4 py-2 border">
                                           <span className={`${order.status==="Paid"?"bg-green-100 text-green-700": order.status==="Pending"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"} px-2 py-1 rounded text-xs font-medium`}>
                                            {order.status}
                                           </span>
                                        </td>

                                        <td className="px-4 py-2 border">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
};

export default AdminOrders;