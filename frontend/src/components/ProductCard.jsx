import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, loading }) => {
    const { productImg, productName, productDesc, price, _id } = product

    const dispatch = useDispatch()
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const addToCart = async (productId) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart`, { "productId": productId }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log("Error in addToCart :",error.message);
            toast.error(error.message)
        }
    };
     
    return (
        <div className="shadow-lg rounded-lg overflow-hidden h-max">
            <div className="w-full h-full aspect-square overflow-hidden" >
                {loading ? <Skeleton className="w-full h-full rounded-lg" /> : <img onClick={() => navigate(`/products/${_id}`)} src={productImg[0]} alt="" className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer" />}

            </div>
            {loading ? <div className="px-2 space-y-2 my-2">
                <Skeleton className="w-50 h-4" />
                <Skeleton className="w-50 h-6" />
                <Skeleton className="w-50 h-8" />
                <Skeleton className="w-50 h-10" />
            </div> : <div className="px-2 space-y-1">
                <h2 className="font-semibold h-12 line-clamp-12">
                    {productName}
                </h2>
                <p className="font-semibold h-12 line-clamp-12">
                    {productDesc    }
                </p>
                <h2 className="font-bold">₹{price}</h2>
                <Button className="bg-green-600 mb-3 w-full cursor-pointer" onClick={() => { addToCart(_id) }}><ShoppingCart />Add to Cart</Button>
            </div>}

        </div>
    )
}
export default ProductCard;