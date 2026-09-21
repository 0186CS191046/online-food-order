import React from "react";

const ProductDesc = ({ product, showAddToCart }) => {
  console.log("Product in ProductDesc:", product);

  const handleAddToCart = () => {
    console.log("Product added to cart:", product);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Product Name */}
      <h1 className="text-3xl font-bold">
        {product?.name || product?.productName}
      </h1>

      {/* Product Description */}
      <p className="text-gray-600">
        {product?.description || product?.productDescription}
      </p>

      {/* Product Price */}
      <p className="text-2xl font-semibold">
        ₹{product?.price || product?.productPrice}
      </p>

      {/* Add To Cart */}
      {showAddToCart && (
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-6 py-3 rounded-lg w-fit hover:bg-gray-800"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductDesc;