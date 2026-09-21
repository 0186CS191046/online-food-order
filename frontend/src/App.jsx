import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoutes from "./components/ProtectedRoutes";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profiles";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Restaurants from "./pages/Restaurant";
import Order from "./pages/Order";

import Cart from "./pages/Cart";
import AddressForm from "./pages/AddressForm";
import OrderSucces from "./pages/OrderSuccess";
import AddProduct from "./pages/admin/AddProduct";
import SingleProduct from "./pages/SingleProduct";
import AddRestaurant from "./pages/AddRestaurant";
import ForgotPassword from "./pages/ForgotPassword";

const router = createBrowserRouter([
  // =========================
  // AUTH
  // =========================

  {
    path: "/",
    element: <Signin />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  // =========================
  // DASHBOARD
  // =========================

  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <>
          <Navbar />
          <Dashboard />
          <Footer />
        </>
      </ProtectedRoutes>
    ),

    children: [
      {
        index: true,
        element: <></>,
      },

      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "add-restaurant",
        element: < AddRestaurant />,
      },
      {
        path: "users",
        element: <Users />,
      },

      {
        path: "restaurants",
        element: <Restaurants />,
      },

      {
        path: "orders",
        element: <Order />,
      },

      {
        path: "profile/:id",
        element: <Profile />,
      },
       {
        path: "add-product",
        element: <AddProduct />,
      },

    ],
  },

  // =========================
  // PROFILE
  // =========================

  {
    path: "/profile",
    element: (
      <ProtectedRoutes>
        <>
          <Navbar />
          <Profile />
        </>
      </ProtectedRoutes>
    ),
  },
{
    path: "/forgot-password",
    element: (
      
        <>
          <ForgotPassword />
        </>
    ),
  },
  {
    path: "/profile/:id",
    element: (
      <ProtectedRoutes>
        <>
          <Navbar />
          <Profile />
        </>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
        <>
          <ResetPassword/>
        </>
    ),
  },

  // =========================
  // CART
  // =========================

  {
    path: "/cart",
    element: (
      <ProtectedRoutes>
        <>
          <Navbar />
          <Cart />
        </>
      </ProtectedRoutes>
    ),
  },

  // =========================
  // ADDRESS
  // =========================

  {
    path: "/address",
    element: (
      <ProtectedRoutes>
        <AddressForm />
      </ProtectedRoutes>
    ),
  },

  // =========================
  // ORDER SUCCESS
  // =========================

  {
    path: "/order-success",
    element: (
      <ProtectedRoutes>
        <OrderSucces />
      </ProtectedRoutes>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;