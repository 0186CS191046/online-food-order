import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import FiltersideBar from "@/components/FiltersideBar";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const getAllUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.log("Error in get all users:", error.message);
            toast.error( error.response?.data?.message || "Failed to fetch users" );
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const filterUsers = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return users.filter((user) => {
            const customerName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";
            const customerEmail = user.email || "";

            const matchesSearch = !searchValue || customerName.toLowerCase().includes(searchValue) || customerEmail.toLowerCase().includes(searchValue)
            return (matchesSearch);
        });
    }, [users, search]);

    return (
        <div className="min-h-screen">
            <div className="flex">

                <div className="flex-1 min-w-0 p-2">
                    <FiltersideBar type="users" search={search} setSearch={setSearch} />
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold"> Users </h1>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#CBCBCB] border-b">
                                    <th className="px-6 py-4 text-left"> S No.</th>
                                    <th className="px-6 py-4 text-left"> Name </th>
                                    <th className="px-6 py-4 text-left"> Email </th>
                                    <th className="px-6 py-4 text-left"> Phone </th>
                                    <th className="px-6 py-4 text-left"> Role </th>
                                    <th className="px-6 py-4 text-left"> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterUsers.length > 0 ? (
                                    filterUsers.map((user, index) => (
                                        <tr key={user._id} className="border-b hover:bg-gray-50" >
                                            <td className="px-6 py-4"> {index + 1} </td>
                                            <td className="px-6 py-4 font-medium"> {user.firstName} {user.lastName} </td>
                                            <td className="px-6 py-4"> {user.email} </td>
                                            <td className="px-6 py-4"> {user.phone || "N/A"} </td>
                                            <td className="px-6 py-4"> {user.role || "-"} </td>
                                            <td className="px-6 py-4 hover:cursor-pointer" onClick={()=> navigate(`/profile/${user._id}`)}> <Eye/></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500" >
                                            No users found
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

export default Users;