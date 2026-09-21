import ProductCard from "../components/ProductCard";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import FiltersideBar from "../components/FiltersideBar"
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const {user} = useSelector((store)=>store.user);
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
        getAllProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let filtered = [...allProducts];

        // Search filter
        if (search.trim() !== "") {
            filtered = filtered.filter((product) =>
                product?.productName
                    ?.toLowerCase()
                    .includes(search.trim().toLowerCase())
            );
        }

        // Category filter
        if (category !== "All") {
            filtered = filtered.filter(
                (product) => product?.category === category
            );
        }

        return filtered;
    }, [allProducts, search, category]);

    useEffect(() => {
        dispatch(setProducts(filteredProducts));
    }, [filteredProducts, dispatch]);

    console.log("search, category, allProducts,", search, category, allProducts,);


    return (
        <div className="min-h-screen">
            <div className="flex">
                <div className="flex-1 min-w-0">

                    {/* Filter section */}
                    <FiltersideBar
                        type="products"
                        allProducts={allProducts}
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                    />

                    {/* Add Product button - outside filter */}
                    {(user.role == "Restaurant") && (<div className="flex justify-end px-10 mt-4">
                        <button
                            className="bg-[#6D8196] text-white px-5 py-2 rounded-md hover:bg-[4A4A4A] cursor-pointer"
                         onClick={()=> navigate("/dashboard/add-product")}>
                            Add Product
                        </button>
                    </div>)}

                    {/* Products */}
                    <div className="p-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))
                            ) : (
                                <h2 className="text-center col-span-full">
                                    No Products found
                                </h2>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Products;