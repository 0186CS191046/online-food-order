import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ProtectedRoutes = ({ adminOnly, children }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const { user } = useSelector(store => store.user);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (!token) {
                    return navigate("/login");
                }

                const decodedToken = jwtDecode(token);
                const isExpired = decodedToken.exp * 1000 < Date.now();

                // ✅ If token expired → call refresh API
                if (isExpired) {
                    try {
                        const resp = await axios.get(
                            `${import.meta.env.VITE_URL}/api/v1/access-token`,
                            { withCredentials: true } // refresh token from cookie
                        );

                        const newToken = resp.data.accessToken;

                        // save new token
                        localStorage.setItem("token", newToken);
                    } catch (err) {
                        // ❌ refresh token also expired
                        localStorage.removeItem("token");
                        return navigate("/login");
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Token error:", error.message);
                navigate("/login");
            }
        };

        verifyToken();
    }, [token, navigate]);

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoutes;