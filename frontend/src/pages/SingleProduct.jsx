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

  const getProduct = async () => {
    try {
      const token = sessionStorage.getItem("token");

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
      }
    } catch (error) {
      console.error(
        "Error fetching product:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      getProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="py-10 max-w-7xl mx-auto">
        <p className="text-center text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-10 max-w-7xl mx-auto">
        <p className="text-center text-red-500">
          Product not found.
        </p>
      </div>
    );
  }
  console.log(")))))))))))))))",product);
  

  return (
    <div className="py-10 max-w-7xl mx-auto px-4">
      <Breadcrums product={product} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <ProductImg images={product.productImg || []} />

        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;