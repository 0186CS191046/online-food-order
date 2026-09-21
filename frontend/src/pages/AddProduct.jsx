import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Card,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { setProducts } from "@/redux/restaurantSlice";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [productData, setProductData] = useState({
        restaurantId: "",
        productName: "",
        productDesc: "",
        price: "",
        category: "",
        productImg: [],
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    const token = sessionStorage.getItem("token");

    const dispatch = useDispatch();

    const { products } = useSelector(
        (store) => store.restaurant
    );

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // UPLOAD IMAGES TO CLOUDINARY
    // ==========================================

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) {
            return;
        }

        // Validate all files
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not a valid image`);
                e.target.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error(
                    `${file.name} must be less than 5 MB`
                );
                e.target.value = "";
                return;
            }
        }

        // Optional maximum number of images
        if (productData.productImg.length + files.length > 5) {
            toast.error("You can upload maximum 5 images");
            e.target.value = "";
            return;
        }

        try {
            setIsUploading(true);

            const cloudName =
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

            const uploadPreset =
                import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName) {
                toast.error(
                    "Cloudinary cloud name is missing"
                );
                return;
            }

            if (!uploadPreset) {
                toast.error(
                    "Cloudinary upload preset is missing"
                );
                return;
            }

            const uploadedImages = [];

            for (const file of files) {
                const formData = new FormData();

                formData.append("file", file);
                formData.append(
                    "upload_preset",
                    uploadPreset
                );

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                const imageUrl =
                    response.data?.secure_url;

                if (imageUrl) {
                    uploadedImages.push(imageUrl);
                }
            }

            if (!uploadedImages.length) {
                toast.error(
                    "No images were uploaded"
                );
                return;
            }

            setProductData((prev) => ({
                ...prev,
                productImg: [
                    ...prev.productImg,
                    ...uploadedImages,
                ],
            }));

            toast.success(
                "Images uploaded successfully"
            );

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

    // ==========================================
    // REMOVE IMAGE
    // ==========================================

    const removeImage = (index) => {
        setProductData((prev) => ({
            ...prev,
            productImg: prev.productImg.filter(
                (_, i) => i !== index
            ),
        }));
    };

    // ==========================================
    // SUBMIT PRODUCT
    // ==========================================

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!productData.restaurantId) {
            toast.error("Please select a restaurant");
            return;
        }

        if (!productData.productName.trim()) {
            toast.error("Product name is required");
            return;
        }

        if (!productData.price) {
            toast.error("Price is required");
            return;
        }

        if (!productData.category.trim()) {
            toast.error("Category is required");
            return;
        }

        if (!productData.productImg.length) {
            toast.error(
                "Please upload at least one image"
            );
            return;
        }

        try {
            setLoading(true);

            // ==============================
            // RAW JSON BODY
            // ==============================

            const payload = {
                restaurantId:
                    productData.restaurantId,

                productName:
                    productData.productName.trim(),

                productDesc:
                    productData.productDesc.trim(),

                price: Number(productData.price),

                category:
                    productData.category.trim(),

                productImg:
                    productData.productImg,
            };

            console.log(
                "Product payload:",
                payload
            );

            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/product`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (res.data.success) {
                dispatch(
                    setProducts([
                        ...products,
                        res.data.product,
                    ])
                );

                toast.success(
                    res.data.message ||
                    "Product added successfully"
                );

                navigate("/dashboard/products")

                setProductData({
                    restaurantId: "",
                    productName: "",
                    productDesc: "",
                    price: "",
                    category: "",
                    productImg: [],
                });
            }

        } catch (error) {
            console.error(
                "Error adding product:",
                error.response?.data ||
                error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to add product!"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // GET RESTAURANTS
    // ==========================================

    const getRestaurants = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/restaurant`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setRestaurants(
                    res.data.restaurants
                );
            }

        } catch (error) {
            console.log(
                "Error fetching restaurants:",
                error.message
            );
        }
    };

    useEffect(() => {
        getRestaurants();
    }, []);

    return (
        <div className="flex-1 flex justify-center items-start pt-5 px-6">

            <Card className="w-full my-20">

                <CardHeader>
                    <CardTitle>
                        Add Product
                    </CardTitle>

                    <p>
                        Enter product details below:
                    </p>
                </CardHeader>

                <form onSubmit={submitHandler}>

                    <CardContent>

                        <div className="flex flex-col gap-4 mt-2">

                            {/* RESTAURANT */}

                            <div className="grid gap-2">

                                <Label>
                                    Restaurant
                                </Label>

                                <select
                                    name="restaurantId"
                                    value={
                                        productData.restaurantId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="border rounded-md p-2"
                                >
                                    <option value="">
                                        Select Restaurant
                                    </option>

                                    {restaurants.map(
                                        (restaurant) => (
                                            <option
                                                key={
                                                    restaurant._id
                                                }
                                                value={
                                                    restaurant._id
                                                }
                                            >
                                                {
                                                    restaurant.restaurantName
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                            {/* PRODUCT NAME */}

                            <div className="grid gap-2">

                                <Label>
                                    Product Name
                                </Label>

                                <Input
                                    type="text"
                                    value={
                                        productData.productName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Ex-Burger"
                                    name="productName"
                                    required
                                />

                            </div>

                            {/* PRICE */}

                            <div className="grid gap-2">

                                <Label>
                                    Price
                                </Label>

                                <Input
                                    type="number"
                                    min="0"
                                    value={
                                        productData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Ex-250"
                                    name="price"
                                    required
                                />

                            </div>

                            {/* CATEGORY */}

                            <div className="grid gap-2">

                                <Label>
                                    Category
                                </Label>

                                <Input
                                    type="text"
                                    value={
                                        productData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Ex-Fast Food"
                                    name="category"
                                    required
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="grid gap-2">

                                <Label>
                                    Product Description
                                </Label>

                                <Textarea
                                    name="productDesc"
                                    value={
                                        productData.productDesc
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter product description"
                                />

                            </div>

                            {/* IMAGE UPLOAD */}

                            <div className="grid gap-2">

                                <Label>
                                    Product Images
                                </Label>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={
                                        handleFileChange
                                    }
                                    disabled={
                                        isUploading
                                    }
                                />

                                {isUploading && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading images...
                                    </div>
                                )}

                                {/* IMAGE PREVIEW */}

                                {productData.productImg.length >
                                    0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">

                                        {productData.productImg.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="relative"
                                                >

                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`Product ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="w-full h-32 object-cover rounded-md border"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(
                                                                index
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                    </CardContent>

                    <CardFooter className="flex-col gap-2">

                        <Button
                            disabled={
                                loading ||
                                isUploading
                            }
                            className="w-full bg-[#6D8196] hover:bg-[#4A4A4A] cursor-pointer mt-4"
                            type="submit"
                        >
                            {loading ? (
                                <span className="flex gap-2 items-center">
                                    <Loader2 className="animate-spin" />
                                    Please Wait...
                                </span>
                            ) : (
                                "Add Product"
                            )}
                        </Button>

                    </CardFooter>

                </form>

            </Card>

        </div>
    );
};

export default AddProduct;