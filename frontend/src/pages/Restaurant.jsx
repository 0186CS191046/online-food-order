import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import FiltersideBar from "@/components/FiltersideBar";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const token = sessionStorage.getItem("token");

    const getAllRestaurants = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/restaurant/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setRestaurants(res.data.restaurants);
            }
        } catch (error) {
            console.log("Error in get all restaurants:", error.message);

            toast.error(
                error.response?.data?.message || "Failed to fetch restaurants"
            );
        }
    };

    useEffect(() => {
        getAllRestaurants();
    }, []);

    return (
        <div className="pt-20 min-h-screen">
            <div className="flex">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 min-w-0 p-2">
                     <FiltersideBar allProducts={restaurants} setCategory={"hyy"} category={"jj"} search={"jj"} setSearch={"jj"} />

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                               Restaurants
                        </h1>
                    </div>

                    {/* Table */}
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
                                {restaurants.length > 0 ? (
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
                                                {restaurant.zipcode || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {restaurant.state || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {restaurant.country || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {restaurant.status? "Active" : "InActive" }
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
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