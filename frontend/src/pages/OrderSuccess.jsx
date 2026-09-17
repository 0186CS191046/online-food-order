import { CheckCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSucces = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <CheckCircle className="h-20 w-20 text-green-500" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold mt-6 text-gray-800">🎉Payment Successful</h1>

                {/* Message */}
                <p className="text-gray-600 mt-6">Thank you for your purchase! Your order has been placed successfuly!</p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                    <button onClick={() => navigate("/")}
                        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                        Continue Shopping
                    </button>
                     <button onClick={() => navigate("/profile/69b68f03029f5968c365f827")}
                        className="w-full border border-green-600 text-green-600 py-3 rounded-xl hover:bg-green-50 transition">
                       View my Orders
                    </button>
                </div>
            </div>
        </div>
    )
};

export default OrderSucces;

