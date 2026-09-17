import ProductCard from "../components/ProductCard";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import FiltersideBar from "../components/FiltersideBar"
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";
import Sidebar from "@/components/Sidebar";

const Products = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [priceRange, setpricerange] = useState([0, 999999]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const dispatch = useDispatch();
    const token = sessionStorage.getItem("token");

    const getAllProducts = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/product/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setAllProducts(res.data.products);
                dispatch(setProducts(res.data.products));
            }
        } catch (error) {
            console.log("Error in get all products:", error.message);
            toast.error(
                error.response?.data?.message || "Failed to fetch products"
            );
        }
    };

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(setProducts([]));
            return;
        }

        let filtered = [...allProducts];

        if (search.trim() !== "") {
            filtered = filtered.filter((p) =>
                p?.productName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            filtered = filtered.filter(
                (p) => p.category === category
            );
        }

        filtered = filtered.filter(
            (p) =>
                p.price >= priceRange[0] &&
                p.price <= priceRange[1]
        );

        dispatch(setProducts(filtered));
    }, [search, priceRange, category, allProducts, dispatch]);

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className="pt-20 min-h-screen">
            
            {/* Sidebar + Main Content */}
            <div className="flex">

                {/* Sidebar */}
                <Sidebar />

                {/* Right Side */}
                <div className="flex-1 min-w-0">

                    {/* Filters */}
                    <FiltersideBar
                        allProducts={allProducts}
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                    />

                    {/* Products */}
                    <div className="p-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                            {allProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Products;