import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import axios from "axios";

const ProtectedRoutes = ({ adminOnly, children }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                let token = sessionStorage.getItem("token");

                if (!token) {
                    navigate("/", { replace: true });
                    return;
                }

                let decodedToken = jwtDecode(token);

                const isExpired =
                    decodedToken?.exp * 1000 < Date.now();

                if (isExpired) {
                    try {
                        const resp = await axios.get(
                            `${import.meta.env.VITE_URL}/api/v1/access-token`,
                            {
                                withCredentials: true,
                            }
                        );

                        const newToken = resp.data.accessToken;

                        if (!newToken) {
                            throw new Error("New access token not received");
                        }

                        sessionStorage.setItem("token", newToken);

                        token = newToken;
                        decodedToken = jwtDecode(newToken);
                    } catch (error) {
                        console.error("Refresh token error:", error);

                        sessionStorage.removeItem("token");
                        navigate("/", { replace: true });
                        return;
                    }
                }

                setRole(decodedToken?.role);
                setIsAuthenticated(true);
                setLoading(false);

            } catch (error) {
                console.error("Token verification error:", error);

                sessionStorage.removeItem("token");
                navigate("/", { replace: true });
            }
        };

        verifyToken();
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && role?.toLowerCase() !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoutes;