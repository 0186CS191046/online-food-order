import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import FiltersideBar from "@/components/FiltersideBar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    let user = null;

    if (token) {
        try {
            user = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const getRestaurants = async () => {
        try {
            setLoading(true);

            const isRestaurantUser = user?.role === "Restaurant";

            const url = isRestaurantUser
                ? `${import.meta.env.VITE_URL}/api/v1/restaurant`
                : `${import.meta.env.VITE_URL}/api/v1/restaurant/all`;

            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Restaurant response:", res.data);

            if (res.data.success) {
                setRestaurants(res.data.restaurants || []);
            } else {
                setRestaurants([]);
            }
        } catch (error) {
            console.log(
                "Error in get restaurants:",
                error.response?.data || error.message
            );

            setRestaurants([]);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch restaurants"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user) {
            getRestaurants();
        }
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex">
                <div className="flex-1 min-w-0 p-2">

                    <FiltersideBar
                        allProducts={restaurants}
                        setCategory={"hyy"}
                        category={"jj"}
                        search={"jj"}
                        setSearch={"jj"}
                    />

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">
                            Restaurants
                        </h1>

                        {user?.role === "Restaurant" && (
                            <button
                                onClick={() =>
                                    navigate("/dashboard/add-restaurant")
                                }
                                className="bg-[#6D8196] text-white px-5 py-2.5 rounded-md hover:opacity-90 transition cursor-pointer"
                            >
                                Add Restaurant
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-[#CBCBCB] border-b">
                                    <th className="px-6 py-4 text-left">
                                        S No.
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Restaurant Name
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Address
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        City
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        ZipCode
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        State
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Country
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            Loading restaurants...
                                        </td>
                                    </tr>
                                ) : restaurants.length > 0 ? (
                                    restaurants.map((restaurant, index) => (
                                        <tr
                                            key={restaurant._id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 font-medium">
                                                {restaurant.restaurantName}
                                            </td>

                                            <td className="px-6 py-4">
                                                {restaurant.address || "N/A"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {restaurant.city || "N/A"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {restaurant.zipCode || "N/A"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {restaurant.state || "N/A"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {restaurant.country || "N/A"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {restaurant.status
                                                    ? "Active"
                                                    : "Inactive"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No Restaurants found
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurants;