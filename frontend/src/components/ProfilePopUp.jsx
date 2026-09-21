import React from "react";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ChangePasswordDialog from "./ChangePassword";
import { useState } from "react";

const ProfilePopup = ({ onClose }) => {
    const token = sessionStorage.getItem("token");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);

    // const { user } = useSelector((store) => store.user);
    const user = jwtDecode(token)

    const logoutHandler = async () => {
        try {
            const resp = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (resp.data.success) {
                dispatch(setUser(null));
                sessionStorage.removeItem("token");

                toast.success(resp.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );

            console.log(
                "Error in logoutHandler:",
                error.message
            );
        }
    };

    const getProfile = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/user`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Profile response:", res.data);

            if (res.data.success) {
                const profileUser = res.data.user;

                // Update Redux
                dispatch(setUser(profileUser));

                // Close popup
                onClose?.();

                // Logged-in user's profile
                navigate(`/profile/${user.id}`);
            }
        } catch (error) {
            console.error(
                "Error getting profile:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to get profile"
            );
        }
    };

    return (
        <>
        <div className="absolute right-0 top-14 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <ul className="py-2">
                <li
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={getProfile}
                >
                    My Profile
                </li>

                <li
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={logoutHandler}
                >
                    Logout
                </li>

                <li
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => setChangePasswordOpen(true)}
                >
                    Change Password
                </li>
            </ul>
        </div>
        <ChangePasswordDialog
    open={changePasswordOpen}
    onOpenChange={setChangePasswordOpen}
/>
</>

        
    );
};

export default ProfilePopup;