import React from "react";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePopup = ({ onClose }) => {
    const token = sessionStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = async () => {
        try {
            const resp = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (resp.data.success) {
                dispatch(setUser(null));
                sessionStorage.removeItem("token");
                toast.success(resp.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.log(
                "Error in logoutHandler:",
                error.message
            );
        }
    };
    return (
        <div className="absolute right-0 top-14 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <ul className="py-2">
                <li
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={onClose}
                >
                    Settings
                </li>

                <li
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={logoutHandler}
                >
                    Logout
                </li>

                <li
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={onClose}
                >
                    Reset Password
                </li>
            </ul>
        </div>
    );
};

export default ProfilePopup;