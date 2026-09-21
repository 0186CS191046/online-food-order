import React, { useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Button, Input } from "@base-ui/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userImg from "../assets/default.jpg";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import MyOrder from "./Order";
import { Edit2 } from "lucide-react";

const Profile = () => {
    const { id: userId } = useParams();
    const [updateBtn, setUpdateBtn] = useState(false);

    const dispatch = useDispatch();

    // Logged-in user from Redux
    const { user: loggedInUser } = useSelector((store) => store.user);

    // Selected user from API
    const [profileUser, setProfileUser] = useState(null);

    const [updateUser, setUpdateUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: null,
        profilePic: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    /*
     * Get selected user profile
     */
    const getUserProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                toast.error("Authentication token not found");
                setIsLoading(false);
                return;
            }

            if (!userId) {
                toast.error("User ID not found");
                setIsLoading(false);
                return;
            }

            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                const userData = res.data.user;

                setProfileUser(userData);

                setUpdateUser({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    address: userData.address || "",
                    city: userData.city || "",
                    zipCode: userData.zipCode || null,
                    profilePic: userData.profilePic || "",
                });
            } else {
                toast.error(
                    res.data.message || "Failed to fetch user profile"
                );
            }
        } catch (error) {
            console.error(
                "Error fetching user profile:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch user profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * Fetch profile whenever URL user ID changes
     */
    useEffect(() => {
        getUserProfile();
    }, [userId]);

    /*
     * Handle input changes
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setUpdateUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /*
     * Upload profile image to Cloudinary
     */

    console.log("loggedInUser.id == profileUser._id ",loggedInUser, profileUser );
    
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        // Validate image type
        if (!selectedFile.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            e.target.value = "";
            return;
        }

        // Validate image size
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5 MB");
            e.target.value = "";
            return;
        }

        try {
            setIsUploading(true);

            const cloudName =
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

            const uploadPreset = "profile_images";

            if (!cloudName) {
                toast.error("Cloudinary cloud name is missing");
                return;
            }

            const formData = new FormData();

            formData.append("file", selectedFile);
            formData.append("upload_preset", uploadPreset);

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );

            const imageUrl = response.data?.secure_url;

            if (!imageUrl) {
                toast.error(
                    "Image URL was not returned by Cloudinary"
                );
                return;
            }

            setUpdateUser((prev) => ({
                ...prev,
                profilePic: imageUrl,
            }));

            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error(
                "Cloudinary upload error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.error?.message ||
                "Image upload failed"
            );
        } finally {
            setIsUploading(false);

            // Allow selecting same image again
            e.target.value = "";
        }
    };

    /*
     * Update selected user's profile
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = sessionStorage.getItem("token");

        if (!accessToken) {
            toast.error("Authentication token not found");
            return;
        }

        if (!userId) {
            toast.error("User ID not found");
            return;
        }

        if (isUploading) {
            toast.error(
                "Please wait until image upload is completed"
            );
            return;
        }

        try {
            setIsUpdating(true);

            const payload = {
                firstName: updateUser.firstName,
                lastName: updateUser.lastName,
                email: updateUser.email,
                phone: updateUser.phone,
                address: updateUser.address,
                city: updateUser.city,
                zipCode: updateUser.zipCode || null,
                profilePic: updateUser.profilePic,
                userId: userId,
            };

            console.log("Update profile payload:", payload);

            const resp = await axios.put(
                `${import.meta.env.VITE_URL}/api/v1/user`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(
                "Update profile response:",
                resp.data
            );

            if (resp.data.success) {
                toast.success(
                    resp.data.message ||
                    "Profile updated successfully"
                );

                /*
                 * Get updated user from API response
                 */
                const updatedUser =
                    resp.data.user || {
                        ...profileUser,
                        ...updateUser,
                    };

                setProfileUser(updatedUser);

                setUpdateUser({
                    firstName: updatedUser.firstName || "",
                    lastName: updatedUser.lastName || "",
                    email: updatedUser.email || "",
                    phone: updatedUser.phone || "",
                    address: updatedUser.address || "",
                    city: updatedUser.city || "",
                    zipCode: updatedUser.zipCode || null,
                    profilePic:
                        updatedUser.profilePic || "",
                });

                /*
                 * Update Redux only if this is the
                 * currently logged-in user's profile.
                 */
                if (
                    loggedInUser?._id &&
                    String(loggedInUser._id) === String(userId)
                ) {
                    dispatch(setUser(updatedUser));
                }
            }
        } catch (error) {
            console.error(
                "Error in handleSubmit:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    /*
     * Loading state
     */
    if (isLoading) {
        return (
            <div className="pt-20 min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-gray-600 text-lg">
                    Loading profile...
                </p>
            </div>
        );
    }

    /*
     * User not found
     */
    if (!profileUser) {
        return (
            <div className="pt-20 min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-gray-600 text-lg">
                    User profile not found
                </p>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-100">
            <Tabs
                defaultValue="profile"
                className="max-w-7xl mx-auto items-center"
            >
                <TabsList>
                    <TabsTrigger value="profile">
                        Profile
                    </TabsTrigger>

                    <TabsTrigger value="orders">
                        Orders
                    </TabsTrigger>
                </TabsList>

                {/* ================= PROFILE ================= */}
                <TabsContent value="profile">
                    <div className="flex flex-col justify-center items-center bg-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-7">
                            <h1 className="font-bold text-2xl text-gray-800">
                                {updateBtn ? "Update Profile" : "Profile"}
                            </h1>

                            {(loggedInUser._id == profileUser._id )&& (<button
                                onClick={() => setUpdateBtn(!updateBtn)}
                                className="cursor-pointer"
                            >
                                <Edit2 size={18} />
                            </button>)}
                        </div>


                        <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <img
                                    src={
                                        updateUser.profilePic ||
                                        userImg
                                    }
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[#6D8196]"
                                />

                                <Label
                                    htmlFor="profile"
                                    className="mt-4 cursor-pointer bg-[#6D8196] text-white px-4 py-2 rounded-lg hover:bg-[#4A4A4A"
                                >
                                    {isUploading
                                        ? "Uploading..."
                                        : "Change Picture"}
                                </Label>

                                <input
                                    type="file"
                                    id="profile"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={
                                        handleFileChange
                                    }
                                    disabled={isUploading}
                                />

                                {isUploading && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Uploading image...
                                    </p>
                                )}
                            </div>

                            {/* Profile Form */}
                            <div>
                                <form
                                    className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
                                    onSubmit={handleSubmit}
                                >
                                    {/* First Name / Last Name */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="block text-sm font-medium">
                                                First Name
                                            </Label>

                                            <Input
                                                type="text"
                                                name="firstName"
                                                placeholder="John"
                                                value={
                                                    updateUser.firstName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium">
                                                Last Name
                                            </Label>

                                            <Input
                                                type="text"
                                                name="lastName"
                                                placeholder="Doe"
                                                value={
                                                    updateUser.lastName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <Label className="block text-sm font-medium">
                                            Email
                                        </Label>

                                        <Input
                                            type="email"
                                            name="email"
                                            value={
                                                updateUser.email
                                            }
                                            disabled
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <Label className="block text-sm font-medium">
                                            Phone
                                        </Label>

                                        <Input
                                            type="text"
                                            name="phone"
                                            placeholder="Enter your contact number"
                                            value={
                                                updateUser.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <Label className="block text-sm font-medium">
                                            Address
                                        </Label>

                                        <Input
                                            type="text"
                                            name="address"
                                            placeholder="Enter your address"
                                            value={
                                                updateUser.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>

                                    {/* City / ZipCode */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="block text-sm font-medium">
                                                City
                                            </Label>

                                            <Input
                                                type="text"
                                                name="city"
                                                placeholder="Enter your city"
                                                value={
                                                    updateUser.city
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium">
                                                Zipcode
                                            </Label>

                                            <Input
                                                type="text"
                                                name="zipCode"
                                                placeholder="Enter your Zipcode"
                                                value={
                                                    updateUser.zipCode
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    {updateBtn && (<Button
                                        type="submit"
                                        disabled={
                                            isUploading ||
                                            isUpdating
                                        }
                                        className="w-full mt-4 bg-[#6D8196] hover:bg-[#4A4A4A] text-white font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isUpdating
                                            ? "Updating..."
                                            : "Update Profile"}
                                    </Button>)}
                                </form>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* ================= ORDERS ================= */}
                <TabsContent value="orders">
                    <MyOrder />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;