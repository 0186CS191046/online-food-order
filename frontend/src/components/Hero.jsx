import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Latest Electronics <br /> at Best Prices
            </h1>

            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-xl">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptops and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">

              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 cursor-pointer" onClick={()=>navigate("/products")}>
                Shop Now
              </Button>

              <Button className="border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-6 py-3 rounded-lg font-semibold cursor-pointer">
             Your Deals
             </Button>

            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">

            <img
              src="/ekart-hero.png"
              alt="Smartphone"
              className="w-105 md:w-130 object-contain drop-shadow-2xl hover:scale-105 transition duration-500"
            />

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;