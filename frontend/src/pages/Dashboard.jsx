import Sidebar from "../components/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 pt-20">
            <div className="flex">
                
                {/* Sidebar */}
                <Sidebar />

                {/* Dashboard Content */}
                <main className="flex-1 min-w-0 p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default Dashboard;