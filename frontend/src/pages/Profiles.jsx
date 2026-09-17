import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Label } from "../components/ui/label";
import { Button, Input } from "@base-ui/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userImg from "../assets/default.jpg"
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import MyOrder from "./MyOrder";

const Profile = () => {
    const {user} = useSelector(store => store.user);
    
    const params = useParams();
    const userId = params.id;
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phone,
        address: user?.address,
        city: user?.city,
        zipcode: user?.zipcode,
        profilePic: user?.profilePic,
        role: user?.role
    });
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setUpdateUser(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })  //preview only
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const acccessToken = localStorage.getItem("token");
        try {
            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("email", updateUser.email);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipcode", updateUser.zipcode);
            formData.append("role", updateUser.role);
            if (file) {
                formData.append("file", file); //image file for backend multer
            }

            const resp = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${acccessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (resp.data.success) {
                toast.success(resp.data.message);                
                dispatch(setUser(resp.data.user))
            }
        } catch (error) {
            console.log("Error in handleSubmit :",error.message);
            toast.error("Failed to update profile...")

        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-100">

            <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">
                        Orders
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div>
                        <div className="flex flex-col justify-center items-center bg-gray-100">
                            <h1 className="font-bold mb-7 text-2xl text-gray-800">
                                Update profile
                            </h1>
                            <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                                {/* profile picture */}
                                <div className="flex flex-col items-center">
                                    <img src={updateUser.profilePic || userImg} alt="" className="w-32 h-32 rounded-full object-cover
                                    border-4 border-green-800"/>
                                    <Label htmlFor="profile" className="mt-4 cursor-pointer bg-green-600 text-white px-4 py-2
                                    rounded-lg hover:bg-green-700">Change Picture</Label>
                                    <input type="file" id="profile" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </div>
                                {/* profile section */}
                                <div>
                                    <form action="" className="space-y-4 shadow-lg p-5 rounded-lg bg-white" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium">FirstName</Label>
                                                <input type="text" name="firstName" placeholder="John"
                                                    className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.firstName} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">LastName</Label>
                                                <Input type="text" name="lastName" placeholder="Doe"
                                                    className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.lastName} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Email</Label>
                                            <Input type="email" name="email" placeholder="Enter your email"
                                                className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.email} disabled onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Phone</Label>
                                            <Input type="number" name="phone" placeholder="Enter your contact number"
                                                className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.phoneNo} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">Address</Label>
                                            <Input type="text" name="address" placeholder="Enter your address"
                                                value={updateUser?.address} onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 mt-1" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium">City</Label>
                                                <input type="text" name="city" placeholder="Enter your city"
                                                    value={updateUser?.city} onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 mt-1" />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">Zipcode</Label>
                                                <Input type="text" name="zipcode"
                                                    value={updateUser?.zipcode} onChange={handleChange}
                                                    placeholder="Enter your Zipcode" className="w-full border rounded-lg px-3 py-2 mt-1" />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold
                                        py-2 rounded-lg ">Update Profile</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </TabsContent>
                <TabsContent value="orders">
                    <MyOrder/>
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default Profile;