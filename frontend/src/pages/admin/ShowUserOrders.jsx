import OrderCard from "@/components/Ordercard";
import Spinner from "@/components/Spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const ShowUserOrders = () => {
    const [userOrder, setUserOrder] = useState([]);
    const [loading,setLoading] = useState(true);
    const { userId } = useParams();

    const getUserOrders = async () => {
        const token = localStorage.getItem("token")
        try {
            const resp = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/user-order/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (resp.data.success) {
                setUserOrder(resp.data.orders)
                toast.success(resp.data.message)
            }
        } catch (error) {
            toast.error("Error getching order details...")
            console.log("Error getching order details...", error.message);
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        getUserOrders()
    }, []);

    if(loading){
        return(<Spinner/>)
    }else{
    return (
        <div className="py-20 w-full">
            <OrderCard userOrder={userOrder} />
        </div>

    )
}
};

export default ShowUserOrders;