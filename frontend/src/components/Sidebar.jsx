import { LayoutDashboard, PackagePlus, PackageSearch, Users } from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
    const token = sessionStorage.getItem("token");
    const location = useLocation();

    let role = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken?.role;
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
            roles: ["Admin", "Restaurant", "User"],
        },
        {
            name: "Restaurants",
            path: "/dashboard/restaurants",
            icon: PackagePlus,
            roles: ["Admin", "User", "Restaurant"],
        },
        {
            name: "Products",
            path: "/dashboard/products",
            icon: PackageSearch,
            roles: ["Admin", "Restaurant", "User"],
        },
        {
            name: "Users",
            path: "/dashboard/users",
            icon: Users,
            roles: ["Admin"],
        },
        {
            name: "Orders",
            path: "/dashboard/orders",
            icon: FaRegEdit,
            roles: ["Admin", "Restaurant", "User"],
        },
        {
            name: "Add Product",
            path: "/dashboard/add-product",
            icon: FaRegEdit,
            roles: ["Restaurant"],
        },
    ];

    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(role)
    );

    return (
        <div className="w-75 hidden md:block border-r bg-[#CBCBCB] border-green-200 p-10 h-[calc(100vh-80px)] shrink-0">
            <div className="text-center px-3 space-y-2">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;

                    // Exact path matching
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`text-xl ${
                                isActive
                                    ? "bg-[#6D8196] text-gray-200"
                                    : "bg-transparent"
                            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}
                        >
                            <Icon />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;