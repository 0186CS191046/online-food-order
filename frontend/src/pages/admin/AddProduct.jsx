import ImageUpload from "@/components/ImageUpload";
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Card
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { setProducts } from "@/redux/restaurantSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AddProduct = () => {
    const [productData, setProductData] = useState({
        restaurantId: "",
        productName: "",
        productDesc: "",
        price: "",
        category: "",
        productImg: []
    });
    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const { products } = useSelector(
        (store) => store.restaurant
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (productData.productImg.length === 0) {
            toast.error(
                "Please select at least one image!"
            );
            return;
        }

        const formData = new FormData();
        formData.append("restaurantId", productData.restaurantId);
        formData.append("productName", productData.productName);
        formData.append("productDesc",productData.productDesc);
        formData.append("price",productData.price);
        formData.append("category", productData.category);
        productData.productImg.forEach((img) => {
            formData.append("files", img);
        });

        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/product`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                dispatch(
                    setProducts([
                        ...products,
                        res.data.product
                    ])
                );
                toast.success(res.data.message);
                setProductData({
                    restaurantId: "",
                    productName: "",
                    productDesc: "",
                    price: "",
                    category: "",
                    productImg: []
                });
            }
        } catch (error) {
            console.log("Error in submit handler:", error.message );
            toast.error(error.response?.data?.message ||"Failed to add product!");
        } finally {
            setLoading(false);
        }
    };

    const getRestaurants = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/restaurant`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res.data.success) {
                setRestaurants(res.data.restaurants);
            }
        } catch (error) {
            console.log("Error fetching restaurants:",error.message);
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
                            <div className="grid gap-2">
                                <Label>Restaurant</Label>
                                <select
                                    name="restaurantId"
                                    value={productData.restaurantId}
                                    onChange={handleChange}
                                    required
                                    className="border rounded-md p-2">
                                    <option value="">
                                        Select Restaurant
                                    </option>
                                    {restaurants.map((restaurant) => (
                                        <option
                                            key={restaurant._id}
                                            value={restaurant._id}>
                                            {restaurant.restaurantName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label> Product Name</Label>
                                <Input
                                    type="text"
                                    value={productData.productName}
                                    onChange={handleChange}
                                    placeholder="Ex-Burger"
                                    name="productName"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>
                                    Price
                                </Label>
                                <Input
                                    type="number"
                                    value={productData.price}
                                    onChange={handleChange}
                                    placeholder="Ex-250"
                                    name="price"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>
                                    Category
                                </Label>
                                <Input
                                    type="text"
                                    value={productData.category}
                                    onChange={handleChange}
                                    placeholder="Ex-Fast Food"
                                    name="category"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>
                                    Product Description
                                </Label>
                                <Textarea
                                    name="productDesc"
                                    value={productData.productDesc}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                />
                            </div>

                            <ImageUpload
                                productData={productData}
                                setProductData={setProductData}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 cursor-pointer mt-4"
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