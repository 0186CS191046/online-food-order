import Breadcrums from "@/components/Breadcrums";
import ProductImg from "@/components/ProductImg";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDesc from "../components/ProductDesc";
import axios from "axios";

const SingleProduct = () => {
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  // Get logged-in user
  const storedUser = sessionStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in sessionStorage:", error);
  }

  console.log("Logged-in user:", user);
  console.log("User role:", user?.role);

  // Show Add to Cart only for role === "role"
  const isRoleUser = user?.role === "role";

  console.log("Show Add To Cart:", isRoleUser);

  const getProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/productById/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product response:", res.data);

      if (res.data.success) {
        setProduct(res.data.product);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error(
        "Error fetching product:",
        error.response?.data || error.message
      );

      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      getProduct();
    }
  }, [productId]);

  // Loading
  if (loading) {
    return (
      <div className="py-10 max-w-7xl mx-auto">
        <p className="text-center text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="py-10 max-w-7xl mx-auto">
        <p className="text-center text-red-500">
          Product not found.
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4">
      <Breadcrums product={product} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Product Images */}
        <ProductImg images={product.productImg || []} />

        {/* Product Description */}
        <ProductDesc
          product={product}
          showAddToCart={isRoleUser}
        />

      </div>
    </div>
  );
};

export default SingleProduct;