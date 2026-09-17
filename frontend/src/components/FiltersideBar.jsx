import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { FaArrowLeft } from 'react-icons/fa';

const FiltersideBar = ({ allProducts, setCategory, category, search, setSearch }) => {
    const categories = allProducts.map(prod => prod.category)
    const uniqueCategory = ["All", ...new Set(categories)]

    const handleCategoryClick = (val) => {
        setCategory(val)
    };

    const resetFilters = () => {
        setSearch("");
        setCategory("All");
    };

    return (<>
        <div className="bg-gray-100 p-4 rounded-md w-full flex items-center justify-center gap-6 ">
            {/* Search */}
               <button 
      onClick={() => window.history.back()} 
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        gap: '8px'
      }}
    >
      <FaArrowLeft /> Go Back
    </button>

            <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-white p-2 rounded-md border-gray-400 border-2 w-64"
            />

            {/* Category */}
            <div className="flex items-center gap-4">
                <h1 className="font-semibold text-l">Category:</h1>

                <div className="flex items-center gap-4">
                    {uniqueCategory.map((item, index) => (
                        <div
                            className="flex items-center gap-2"
                            key={index}
                        >
                            <input
                                type="radio"
                                checked={category === item}
                                onChange={() => handleCategoryClick(item)}
                                className="cursor-pointer"
                            />

                            <label>{item}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset */}
            <Button
                onClick={resetFilters}
                className="bg-[#6D8196] text-white cursor-pointer"
            >
                Reset Filters
            </Button>
        </div>
    </>
    )
};

export default FiltersideBar;