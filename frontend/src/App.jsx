import React from "react";
import { Button } from "./components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profiles";
import Footer from "./components/Footer";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminProducts from "./pages/admin/AdminProduct";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSucces from "./pages/OrderSuccess";
import Users from "./pages/Users";
import Restaurants from "./pages/Restaurant";
import AdminSignin from "./pages/admin/AdminLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <> <Signin /></>
  },
  {
    path: "/signup",
    element: <><Signup /></>
  },
  {
    path: "/dashboard",
    element: <><Navbar /> <Dashboard /> <Footer /></>
  },
  {
    path: "/profile/:id",
    element: <><ProtectedRoutes ><Navbar /><Profile /></ProtectedRoutes></>
  },
  {
    path: "/dashboard/products",
    element: <><Navbar /><Products /></>
  },
  {
    path: "/dashboard/users",
    element: <><Navbar /> <Users /> <Footer /></>
  },
  {
    path: "/dashboard/restaurants",
    element: <><Navbar /> <Restaurants /> <Footer /></>
  },
  {
    path: "/products/:id",
    element: <><Navbar /><SingleProduct /></>
  },
  {
    path: "/cart",
    element: <><ProtectedRoutes><Navbar /><Cart /></ProtectedRoutes></>
  },
  {
    path: "/order-success",
    element: <><ProtectedRoutes><OrderSucces /></ProtectedRoutes></>
  },
  {
    path: "/address",
    element: <><ProtectedRoutes><AddressForm /></ProtectedRoutes></>
  },
  {
    path: "/dashboard",
    element: <></>,
    children: [
      {
        path: "add-product",
        element: <AddProduct />
      },
      {
        path: "products",
        element: <><AdminProducts /></>
      },
      {
        path: "orders",
        element: <><AdminOrders /></>
      },
      {
        path: "users",
        element: <><AdminUsers /></>
      },
      {
        path: "users/:id",
        element: <><UserInfo /></>
      },
      {
        path: "users/orders/:userId",
        element: <><ShowUserOrders /></>
      }
    ]


  }
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;