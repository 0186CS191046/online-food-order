import { ArrowLeft, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import userImg from "../../assets/default.jpg";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { setUser } from "@/redux/userSlice";
import Spinner from "@/components/Spinner";

const UserInfo = () => {
    // const    
    const [updateUser, setUpdateUser] = useState(null);
    const [file, setFile] = useState(null);
    const [loading,setLoading] = useState(true);
    const { user } = useSelector(store => store.user);
    const params = useParams();
    const userId = params.id;

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
        const accessToken = localStorage.getItem("token");
        try {
            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("email", updateUser.email);
            formData.append("phoneNo", updateUser.phone);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipcode", updateUser.zipcode);
            formData.append("role", updateUser.role);
            if (file) {
                formData.append("file", file); //image file for backend multer
            }

            const resp = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (resp.data.success) {
                toast.success(resp.data.message);
                dispatch(setUser(resp.data.user))
            }
        } catch (error) {
            console.log("Failed to update profile...",error.message);
            toast.error("Failed to update profile...")

        }
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getUserDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/${userId}`);

            if (res.data.success) {
                setUpdateUser(res.data.users)
            }
        } catch (error) {
            console.log("Error in getUserDetails...",error);

        }
        finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        getUserDetails();
    }, [])


    if(loading){
        return( <Spinner/>)
    }else{
    return (
        <div className="ml-87.5 p-6 mt-16">
            <div className="flex items-center gap-3 mb-6">
            <Button className="cursor-pointer" variant="outline"  onClick={() => { navigate(-1) }}><ArrowLeft /></Button>
            <h1 className="font-bold text-2xl text-gray-800">Update Profile</h1>
            </div>
       
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-100 min-h-screen">

                    <div className="flex justify-between gap-10">

                    </div>
                    <div className="w-full flex gap-10 items-start px-7 max-w-4xl">
                        {/* profile picture */}
                        <div className="flex flex-col items-center">
                            <img src={updateUser?.profilePic || userImg} alt="" className="w-32 h-32 rounded-full object-cover
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
                                        <Label className="block text-sm font-medium" htmlFor="firstName">FirstName</Label>
                                        <input type="text" name="firstName" placeholder="John"
                                            className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.firstName} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium" htmlFor="lastName">LastName</Label>
                                        <Input type="text" name="lastName" placeholder="Doe"
                                            className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.lastName} onChange={handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium" htmlFor="email">Email</Label>
                                    <Input type="email" name="email" placeholder="Enter your email"
                                        className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.email} disabled />
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium" htmlFor="phone">Phone</Label>
                                    <Input type="number" name="phone" placeholder="Enter your contact number"
                                        className="w-full border rounded-lg px-3 py-2 mt-1" value={updateUser?.phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium" htmlFor="address">Address</Label>
                                    <Input type="text" name="address" placeholder="Enter your address"
                                        value={updateUser?.address} onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block text-sm font-medium" htmlFor="city">City</Label>
                                        <input type="text" name="city" placeholder="Enter your city"
                                            value={updateUser?.city} onChange={handleChange}
                                            className="w-full border rounded-lg px-3 py-2 mt-1" />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium" htmlFor="zipcode">Zipcode</Label>
                                        <Input type="text" name="zipcode"
                                            value={updateUser?.zipcode} onChange={handleChange}
                                            placeholder="Enter your Zipcode" className="w-full border rounded-lg px-3 py-2 mt-1" />
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Label className="block text-sm font-medium">Role:</Label>
                                    <RadioGroup value={updateUser?.role} onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })} className="flex items-center" >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="user" id="user" />
                                            <Label htmlFor="user">User</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="admin" id="admin" />
                                            <Label htmlFor="admin">Admin</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold
                                        py-2 rounded-lg cursor-pointer">Update Profile</Button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
};

export default UserInfo;