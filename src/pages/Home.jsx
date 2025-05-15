// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ── Custom Prev/Next Arrows ─────────────────────────────────────
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-60 rounded-full hover:bg-opacity-90"
  >
    <svg xmlns="http://www.w3.org/2000/svg"
         className="w-6 h-6 text-gray-800"
         fill="none" viewBox="0 0 24 24"
         stroke="currentColor">
      <path strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-60 rounded-full hover:bg-opacity-90"
  >
    <svg xmlns="http://www.w3.org/2000/svg"
         className="w-6 h-6 text-gray-800"
         fill="none" viewBox="0 0 24 24"
         stroke="currentColor">
      <path strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const Home = () => {
  const [products, setProducts]   = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(({ data }) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  // 0–1 → hero banners | 2–5 → home tab | 6–9 → office tab
  const bannerProducts = products.slice(0, 2);
  const homeProducts   = products.slice(2, 6);
  const officeProducts = products.slice(6, 10);

  const heroSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div id="main-wrapper">
      {/* ========== HERO SLIDER ========== */}
      <section className="hero-section relative">
        {bannerProducts.length > 0 && (
          <Slider {...heroSettings}>
            {bannerProducts.map((p) => (
              <div key={p._id} className="relative h-[500px]">
                <Link to={`/product/${p._id}`} className="block w-full h-full">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* ========== CURRENTLY ON GREAT DEALS ========== */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Currently on Great Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bannerProducts.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="block">
                <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POPULAR FURNITURE TABS ========== */}
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
                className={`px-6 py-2 border rounded ${
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

      {/* ========== FEATURES ========== */}
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
