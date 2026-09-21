import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images = [] }) => {
  const validImages = images.filter(
    (image) => image && image.trim() !== ""
  );

  const [img, setImg] = useState("");

  useEffect(() => {
    if (validImages.length > 0) {
      setImg(validImages[0]);
    }
  }, [images]);

  if (!validImages.length) {
    return (
      <div className="w-full h-50 flex items-center justify-center border rounded-lg">
        No image available
      </div>
    );
  }

  return (
    <div className="flex gap-5 w-full">
      {/* Thumbnails */}
      <div className="flex flex-col gap-5 shrink-0">
        {validImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product ${index + 1}`}
            onClick={() => setImg(image)}
            className="cursor-pointer w-20 h-20 object-cover border shadow-lg rounded"
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="w-full max-w-125">
        <Zoom>
          <img
            src={img || validImages[0]}
            alt="Product"
            className="w-full h-125 object-cover border shadow-lg rounded"
          />
        </Zoom>
      </div>
    </div>
  );
};

export default ProductImg;