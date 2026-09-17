
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfilePopup from "../components/profilePopUp"
import { useState } from "react";

const Navbar = () => {
    const { user } = useSelector((store) => store.user);
    const { cart } = useSelector((store) => store.restaurant);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const admin = user?.role === "admin";

    console.log("cart---------", cart);

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
                        <Link to="/">
                            <li>Home</li>
                        </Link>
                        <Link to="/products">
                            <li>Products</li>
                        </Link>
                        {user && (
                            <Link to={`/profile/${user._id}`}>
                                <li>
                                    Hello {user.firstName}
                                </li>
                            </Link>
                        )}
                        {admin && (
                            <Link to="/">
                                <li>Admin Dashboard</li>
                            </Link>
                        )}
                    </ul>
                    <Link
                        to="/cart"
                        className="relative"
                    >
                        <ShoppingCart size={24} className="text-white" />
                        <span className="absolute -top-2 -right-3  text-white text-xs px-2 py-0.5 rounded-full">
                            {cart?.items?.length || 0}
                        </span>
                    </Link>

                    <Button
                        className="bg-[#CBCBCB] hover:bg-[#CBCBCB] cursor-pointer w-12 h-12 rounded-full p-0"
                    onClick={() => setShowProfilePopup((prev) => !prev)}
                    >
                        <img
                            src="/profile1.jpg"
                            alt="profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </Button>
                    {showProfilePopup && (
                        <ProfilePopup
                            onClose={() => setShowProfilePopup(false)}
                        />
                    )}

                </nav>
            </div>
        </header>
    );
};

export default Navbar;