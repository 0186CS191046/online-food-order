
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import userLogo from "../../assets/default.jpg"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

const AdminUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token")
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setAllUsers(res.data.users)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log("Error in fetchUsers :", error.message);
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    const filteredUsers = allUsers.filter((user) =>
        `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchUsers()
    }, []);

    if (loading) {
        return (<Spinner />)
    } else {
        return (
            <div className="py-20 mx-auto px-4">
                <h1 className="font-bold text-2xl">User management</h1>
                <p>View and manage registered users</p>
                <div className="flex relative w-75 mt-6">
                    <Search className="absolute left-2 top-1 text-gray-500 w-5" />
                    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" placeholder="Search Users..." />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-7">
                    {filteredUsers.map((user, index) => {
                        return <div key={index} className="bg-green-100 p-5 rounded-lg ">
                            <div className="flex items-center gap-2">
                                <img src={user?.profilePic || userLogo} alt=""
                                    className="rounded-full w-16 aspect-square object-cover border border-green-600" />
                                <div>
                                    <h1 className="font-semibold"> {user?.firstName} {user?.lastName}</h1>
                                    <h3>{user?.email}</h3>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-3">
                                <Button className="cursor-pointer" onClick={() => navigate(`/dashboard/users/${user?._id}`)} variant="outline"><Edit />Edit</Button>
                                <Button className="cursor-pointer" onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}><Eye />Show Order</Button>

                            </div>
                        </div>
                    })
                    }
                </div>
            </div>
        )
    }
};

export default AdminUsers;