import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHome from "../components/DashboardHome";

const Dashboard = () => {
    const location = useLocation();

    const isDashboardHome =
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/";

    return (
        <div className="min-h-screen bg-gray-100 pt-20">

            <div className="flex">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 min-w-0 p-6">

                    {isDashboardHome ? (
                        <DashboardHome />
                    ) : (
                        <Outlet />
                    )}

                </main>

            </div>

        </div>
    );
};

export default Dashboard;