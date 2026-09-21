import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart, Pencil } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductCard = ({ product, loading }) => {
    const {
        productImg,
        productName,
        productDesc,
        price,
        _id
    } = product;

    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const dispatch = useDispatch();

const handleAddToCart = async () => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/cart`,
            {
                productId: product._id,
            },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        );

        if (res.data.success) {
            dispatch(setCart(res.data.cart));

            toast.success("Product added to cart");
        }
    } catch (error) {
        console.log("Error adding to cart:", error);

        toast.error(
            error.response?.data?.message || "Failed to add product"
        );
    }
};


        const {user} = useSelector((store)=>store.user)
         
    const addToCart = async (productId) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/cart`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                console.log("res.data",res.data);
                
                toast.success(res.data.message);
                dispatch(setCart(res.data.cart));
            }
        } catch (error) {
            console.log("Error in addToCart:", error.message);

            toast.error(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    };

    const handleEditProduct = () => {
        navigate(`/dashboard/product/edit/${_id}`);
    };

    return (
        <div className="shadow-lg rounded-lg overflow-hidden h-max">

            {/* Product Image */}
            <div className="w-full aspect-square overflow-hidden">
                {loading ? (
                    <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                    <img
                        onClick={() =>
                            navigate(`/dashboard/product/${_id}`)
                        }
                        src={productImg?.[0]}
                        alt={productName}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                    />
                )}
            </div>

            {/* Product Details */}
            {loading ? (
                <div className="px-2 space-y-2 my-2">
                    <Skeleton className="w-50 h-4" />
                    <Skeleton className="w-50 h-6" />
                    <Skeleton className="w-50 h-8" />
                    <Skeleton className="w-full h-10" />
                </div>
            ) : (
                <div className="px-2 py-2">

                    <h2 className="font-semibold h-7 line-clamp-2">
                        {productName}
                    </h2>

                    <p className="h-7 line-clamp-2">
                        {productDesc}
                    </p>

                    <h2 className="font-bold">
                        ₹{price}
                    </h2>

                    {/* Normal User */}
                    {user.role === "User" && (
                        <Button
                            className="bg-[#6D8196] mb-3 w-full cursor-pointer"
                            onClick={() => addToCart(_id)}
                        >
                            <ShoppingCart />
                            Add to Cart
                        </Button>
                    )}

                    {/* Restaurant User */}
                    {user.role === "Restaurant" && (
                        <Button
                            className="bg-[#6D8196] mb-3 w-full cursor-pointer"
                            onClick={handleEditProduct}
                        >
                            <Pencil />
                            Edit Product
                        </Button>
                    )}

                </div>
            )}
        </div>
    );
};

export default ProductCard;