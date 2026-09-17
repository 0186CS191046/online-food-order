import OrderCard from "@/components/Ordercard";
import Spinner from "../components/Spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrder = () => {
    const [userOrder, setUserOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token")
    const getuserOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setUserOrder(res.data.orders)
            }
        } catch (error) {
            console.log("Error fetching order details...",error.message);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getuserOrders()
    }, [])

    if (loading) {
        return (<Spinner />)
    } else {
        return (
            <OrderCard userOrder={userOrder} />
        )
    }

}

export default MyOrder;