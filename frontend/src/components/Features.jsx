

import { Truck, ShieldCheck, Headphones } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-blue-500" />,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: <Headphones className="w-8 h-8 text-purple-500" />,
      title: "24/7 Support",
      description: "Always here to help",
    },
  ];

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            {item.icon}
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}