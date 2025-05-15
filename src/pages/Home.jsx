// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    // fetch all products once
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(({ data }) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // Hero slider settings
  const heroSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
  };

  // split your products array:
  // 0 & 1 => banners
  // 2–5 => home tab
  // 6–9 => office tab
  const bannerProducts = products.slice(0, 2);
  const homeProducts = products.slice(2, 6);
  const officeProducts = products.slice(6, 10);

  return (
    <div id="main-wrapper" className="pt-[128px]">
      {/* ========== Hero Slider ========== */}
      <section className="hero-section relative">
        <Slider {...heroSettings}>
          {[1, 2].map((_, i) => (
            <div key={i} className="relative h-[500px]">
              <img
                src={`/assets/images/hero/hero-${i + 1}.jpg`}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Creative Design
                    <br />
                    Modern &amp; Exclusive Furniture
                  </h2>
                  <Link to="/product/${prod._id}" className="btn bg-black text-white">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ========== Banner Section ========== */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bannerProducts.map((prod, idx) => (
              <div
                key={prod._id}
                className="relative overflow-hidden rounded-lg shadow-lg"
              >
                <Link to={`/product/${prod._id}`}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/50 to-transparent">
                  <h3 className="text-2xl font-bold text-white">
                    {prod.title}
                  </h3>
                  <Link
                    to={`/product/${prod._id}`}
                    className="inline-block mt-2 text-orange-400 font-semibold"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Popular Furniture Tabs ========== */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Popular Furniture
          </h2>

          <div className="flex justify-center space-x-4 mb-8">
            {["home", "office"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 border ${
                  activeTab === tab
                    ? "border-black bg-white font-bold"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === "home" ? homeProducts : officeProducts).map(
              (prod) => (
                <div
                  key={prod._id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <Link to={`/product/${prod._id}`}>
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-48 object-contain p-4"
                    />
                  </Link>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">
                      <Link to={`/product/${prod._id}`}>{prod.title}</Link>
                    </h4>
                    <p className="text-lg font-bold">₹{prod.price}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========== Features ========== */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "feature-1.png",
              title: "Free home delivery",
              desc: "On orders over $100",
            },
            {
              icon: "feature-2.png",
              title: "Quality Products",
              desc: "Our main goal",
            },
            {
              icon: "feature-3.png",
              title: "3 Days Return",
              desc: "If you’re not happy",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <img
                src={`/assets/images/icons/${icon}`}
                alt=""
                className="h-12 mb-4"
              />
              <h5 className="font-bold mb-2">{title}</h5>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
