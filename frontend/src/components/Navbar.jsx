import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import ProfilePopup from "../components/profilePopUp";
import { loadCart } from "@/api/cartApi";

const Navbar = () => {
    const { cart } = useSelector((store) => store.restaurant);
    const { user } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (user?.role === "User") {
            loadCart(dispatch);
        }
    }, [token, user?.role, dispatch]);

    const cartCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

    const handleCartClick = () => {
        navigate("/cart");
    };

    return (
        <header className="bg-[#4A4A4A] fixed top-0 w-full z-50 border-b border-[#4A4A4A]">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
                <div className="flex items-center">
                    <img
                        src="/restarant.png"
                        alt="Restaurant Logo"
                        className="h-12 object-contain"
                    />
                </div>
                <nav className="flex gap-8 items-center font-semibold">
                    <ul className="flex gap-6 items-center text-white">
                        <Link to="/dashboard">
                            <li>
                                Home
                            </li>
                        </Link>
                        <Link to="/dashboard/products">
                            <li>
                                Products
                            </li>
                        </Link>
                        {user && (
                            <li>
                                Hello {user.firstName}
                            </li>
                        )}
                    </ul>
                    {user?.role === "User" && (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            className="relative cursor-pointer"
                        >
                            <ShoppingCart
                                size={24}
                                className="text-white" />
                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-gray-100 text-black text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    )}

                    <div className="relative">
                        <Button
                            className="bg-[#CBCBCB] hover:bg-[#CBCBCB] cursor-pointer w-12 h-12 rounded-full p-0"
                            onClick={() =>
                                setShowProfilePopup(
                                    (prev) => !prev
                                )
                            }
                        >
                            <img
                                src="/profile1.jpg"
                                alt="profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </Button>
                        {showProfilePopup && (
                            <ProfilePopup
                                onClose={() =>
                                    setShowProfilePopup(false)
                                }
                            />
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;