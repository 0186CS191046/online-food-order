
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaArrowLeft } from "react-icons/fa";

const FiltersideBar = ({ type = "products", search, setSearch, allProducts = [], category, setCategory, status, setStatus, startDate, setStartDate, endDate, setEndDate }) => {
    const categories = allProducts.map((product) => product?.category) .filter(Boolean);
    const uniqueCategory = ["All",...new Set(categories),];

    const resetFilters = () => {
        setSearch?.("");
        if (type === "products") {
            setCategory?.("All");
        }
        if (type === "orders") {
            setStatus?.("All");
            setStartDate?.("");
            setEndDate?.("");
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-md w-full flex items-center justify-center gap-6 flex-wrap">
            <button onClick={() => window.history.back()}
                className="flex items-center gap-2 text-base cursor-pointer bg-transparent border-none" >
                <FaArrowLeft />
                Go Back
            </button>

            <Input
                type="text"
                value={search || ""}
                onChange={(e) =>
                    setSearch?.(e.target.value)
                }
                placeholder={
                    type === "users"
                        ? "Search users..."
                        : type === "orders"
                            ? "Search orders..."
                            : "Search products..."
                }
                className="bg-white p-2 rounded-md border-gray-400 border-2 w-64"
            />

            {type === "products" && (
                <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="font-semibold">
                        Category:
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                        {uniqueCategory.map(
                            (item, index) => (
                                <div
                                    className="flex items-center gap-2"
                                    key={index}
                                >
                                    <input
                                        type="radio"
                                        checked={
                                            category ===
                                            item
                                        }
                                        onChange={() =>
                                            setCategory?.(
                                                item
                                            )
                                        }
                                        className="cursor-pointer"
                                    />
                                    <label>
                                        {item}
                                    </label>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {type === "orders" && (
                <>
                    <div className="flex items-center gap-3">
                        <label className="font-semibold">
                            Status:
                        </label>

                        <select
                            value={status || "All"}
                            onChange={(e) =>
                                setStatus?.(
                                    e.target.value
                                )
                            }
                            className="bg-white border-2 border-gray-400 rounded-md px-3 py-2"
                        >
                            <option value="All">
                                All
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Confirmed">
                                Confirmed
                            </option>

                            <option value="Preparing">
                                Preparing
                            </option>

                            <option value="Ready">
                                Ready
                            </option>

                            <option value="Out for Delivery">
                                Out for Delivery
                            </option>

                            <option value="Delivered">
                                Delivered
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="font-semibold">
                            From:
                        </label>
                        <Input
                            type="date"
                            value={startDate || ""}
                            onChange={(e) =>
                                setStartDate?.(
                                    e.target.value
                                )
                            }
                            className="bg-white border-2 border-gray-400 w-40"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="font-semibold">
                            To:
                        </label>
                        <Input
                            type="date"
                            value={endDate || ""}
                            onChange={(e) =>
                                setEndDate?.(
                                    e.target.value
                                )
                            }
                            className="bg-white border-2 border-gray-400 w-40"
                        />
                    </div>
                </>
            )}

            <Button
                onClick={resetFilters}
                className="bg-[#6D8196] text-white cursor-pointer"
            >
                Reset Filters
            </Button>
        </div>
    );
};

export default FiltersideBar;
