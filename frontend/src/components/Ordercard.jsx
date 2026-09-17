import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col gap-3">
            <div className="w-full p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
                    <h1 className="text-2xl font-bold">Orders</h1>
                </div>
                {userOrder?.length == 0 ? (
                    <p className="text-gray-800 space-y-6 text-2xl">No order found for this user</p>

                ) : (
                    <div className="space-y-6 w-full">
                        {userOrder.map((order, idx) => (
                            <div key={idx} className="shadow-lg rounded-2xl p-5 border-gray-200">
                                {/* order header */}
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">OrderId :<span className="text-gray-600">{order._id}</span> </h2>
                                    <p className="text-sm text-gray-500">Amount : <span className="font-bold">{order.currency} {order.amount.toFixed(2)}</span></p>
                                </div>

                                {/* user info */}
                                <div className="flex justify-between items-center">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-700"><span className="font-medium">User : </span>
                                            {order?.userId?.firstName || "Unknown"} {order?.userId?.lastName}</p>
                                        <p className="text-sm text-gray-500">Email : {order?.userId?.email || "N/A"}</p>
                                    </div>
                                    <span className={`${order.status === "Paid" ? "bg-green-500" : order.status === "Failed" ? "bg-red-500" : "bg-orange-300"} text-white px-2 py-1`} >{order.status}</span>
                                </div>

                                {/* products */}
                                <div >
                                    <h3 className="font-medium mb-2">Products:</h3>
                                    <ul className="space-y-2">{
                                        order.products.map((product, index) => (
                                            <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <img onClick={() => navigate(`/products/${product.productId?._id}`)} className="w-16 cursor-pointer" src={product?.productId?.productImg?.[0]?.url} />
                                                <span className="w-75 line-clamp-2">{product?.productId?.productName}</span>
                                                <span>{product?.productId?._id}</span>
                                                <span className="font-medium">₹ {product?.productId?.price} x {product.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            </div>
                        ))}
                    </div>

                )}
            </div>

        </div>
    )
}

export default OrderCard;