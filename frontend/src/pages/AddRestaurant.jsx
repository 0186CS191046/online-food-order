import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
    const token = sessionStorage.getItem("token");
    const [imagePreview, setImagePreview] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const navigate = useNavigate();
    const [formData, setFormData] = useState({
        restaurantName: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        category: "",
        startTime: "",
        endTime: "",
        images: [],
    });

    const handleInput = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    

const handleImage = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    // Maximum 5 images
    if (formData.images.length + files.length > 5) {
        toast.error("You can upload maximum 5 images");
        e.target.value = "";
        return;
    }

    // Validate files
    for (const file of files) {
        if (!file.type.startsWith("image/")) {
            toast.error(`${file.name} is not a valid image`);
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} must be less than 5 MB`);
            e.target.value = "";
            return;
        }
    }

    try {
        setIsUploading(true);

        const cloudName =
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const uploadPreset =
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary configuration is missing");
            return;
        }

        const uploadedImages = [];

        for (const file of files) {
            // Preview first image
            if (!imagePreview) {
                setImagePreview(URL.createObjectURL(file));
            }

            const imageData = new FormData();

            imageData.append("file", file);
            imageData.append("upload_preset", uploadPreset);

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                imageData
            );

            const imageUrl = response.data?.secure_url;

            if (imageUrl) {
                uploadedImages.push(imageUrl);
            }
        }

        if (!uploadedImages.length) {
            toast.error("No images were uploaded");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...uploadedImages],
        }));

        toast.success("Images uploaded successfully");

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
        e.target.value = "";
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Restaurant Data:", formData);
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/restaurant`,formData,{
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" : `Bearer ${token}`
                }
            })
            console.log("res---------",res);
            

            // API call will go here
            if(res.data.success){
                toast.success("Restaurant added successfully");
                console.log(")))))))))))");
                
                navigate("/dashboard/restaurants")
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to add restaurant");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Add Restaurant
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Add your restaurant details below.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm border p-6 space-y-8"
                >

                    {/* Restaurant Information */}
                    <div>
                        <h2 className="text-xl font-semibold mb-5">
                            Restaurant Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="grid gap-2">
                                <Label htmlFor="restaurantName">
                                    Restaurant Name
                                </Label>

                                <Input
                                    id="restaurantName"
                                    name="restaurantName"
                                    placeholder="Enter restaurant name"
                                    value={formData.restaurantName}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">
                                    Cuisine
                                </Label>

                                <Input
                                    id="category"
                                    name="category"
                                    placeholder="e.g. Indian, Chinese"
                                    value={formData.category}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="description">
                                    Description
                                </Label>

                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter restaurant description"
                                    value={formData.description}
                                    onChange={handleInput}
                                    rows={4}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h2 className="text-xl font-semibold mb-5">
                            Contact Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="restaurant@example.com"
                                    value={formData.email}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">
                                    Phone Number
                                </Label>

                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h2 className="text-xl font-semibold mb-5">
                            Restaurant Address
                        </h2>

                        <div className="grid gap-5">

                            <div className="grid gap-2">
                                <Label htmlFor="address">
                                    Address
                                </Label>

                                <Textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter complete address"
                                    value={formData.address}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-5">

                                <div className="grid gap-2">
                                    <Label htmlFor="city">
                                        City
                                    </Label>

                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="state">
                                        State
                                    </Label>

                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="zipCode">
                                        Pincode
                                    </Label>

                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        placeholder="Pincode"
                                        value={Number(formData.zipCode)}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="country">
                                        Country
                                    </Label>

                                    <Input
                                        id="country"
                                        name="country"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>
                                

                            </div>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h2 className="text-xl font-semibold mb-5">
                            Opening Hours
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="grid gap-2">
                                <Label htmlFor="startTime">
                                    Opening Time
                                </Label>

                                <Input
                                    id="startTime"
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="endTime">
                                    Closing Time
                                </Label>

                                <Input
                                    id="endTime"
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    {/* Restaurant Image */}
                    {/* Restaurant Image */}
<div>
    <h2 className="text-xl font-semibold mb-5">
        Restaurant Image
    </h2>

    <label
        htmlFor="images"
        className="border-2 border-dashed rounded-xl p-6
        flex flex-col items-center justify-center
        cursor-pointer hover:bg-gray-50 transition"
    >
        {imagePreview ? (
            <img
                src={imagePreview}
                alt="Restaurant preview"
                className="w-48 h-48 object-cover rounded-lg"
            />
        ) : (
            <>
                <ImagePlus
                    size={40}
                    className="text-gray-400 mb-3"
                />

                <p className="font-medium">
                    Upload Restaurant Image
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG or JPEG • Max 5 MB
                </p>
            </>
        )}

        <Input
    id="images"
    type="file"
    accept="image/png,image/jpeg,image/jpg"
    multiple
    onChange={handleImage}
    className="hidden"
/>
    </label>

    {isUploading && (
        <p className="text-sm text-gray-500 mt-2">
            Uploading image...
        </p>
    )}
</div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-4 border-t">

                        <Button
    type="button"
    variant="outline"
    onClick={() => {
        setFormData({
            restaurantName: "",
            description: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            category: "",
            startTime: "",
            endTime: "",
            images: [],
        });

        setImagePreview(null);
    }}
>
    Reset
</Button>

                        <Button
                            type="submit"
                            className="bg-[#6D8196] px-8 cursor-pointer"
                        >
                            Add Restaurant
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddRestaurant;