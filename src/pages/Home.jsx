// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ───────────── automatically pick up every image placed under  /src/assets/hero/ ───────────── */
const heroImages = Object.values(
  import.meta.glob("/src/assets/hero/*.{jpg,jpeg,png}", { eager: true, as: "url" })
);

/* ───────────── slider arrows (simple circles) ───────────── */
const Arrow = ({ className, style, onClick, direction }) => (
  <button
    type="button"
    onClick={onClick}
    className={`absolute top-1/2 z-10 -translate-y-1/2 w-9 h-9 flex items-center justify-center
                rounded-full bg-white/60 hover:bg-white shadow ${direction === "prev" ? "left-4" : "right-4"}`}
  >
    {direction === "prev" ? "‹" : "›"}
  </button>
);

const heroSettings = {
  autoplay: true,
  autoplaySpeed: 6000,
  infinite: true,
  arrows: true,
  dots: false,
  slidesToShow: 1,
  prevArrow: <Arrow direction="prev" />,
  nextArrow: <Arrow direction="next" />,
};

const Home = () => {
  /* ---------------- data (products) ---------------- */
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(({ data }) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  /* 0–1 banner | 2–5 home deals | 6–9 office deals */
  const bannerProducts = products.slice(0, 2);
  const homeProducts   = products.slice(2, 6);
  const officeProducts = products.slice(6, 10);

  const [activeTab, setActiveTab] = useState("home");

  /* ---------------- render ---------------- */
  return (
    <div id="main-wrapper">
      {/* ────────────────── HERO SLIDER ────────────────── */}
      <section className="hero-section relative">
        <Slider {...heroSettings}>
          {heroImages.map((src, i) => (
            <div key={i} className="relative h-[400px]">
              <img src={src} alt={`Hero ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Creative Design
                    <br />
                    Modern &amp; Exclusive Furniture
                  </h2>
                  <Link to="/products" className="btn bg-white/80 hover:bg-white">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ────────────────── GREAT DEALS BANNER PAIR ────────────────── */}
      {bannerProducts.length === 2 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-4">Great Deals Right Now</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bannerProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="relative overflow-hidden rounded-lg shadow group"
                >
                  <img src={p.imageUrl} alt={p.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
                  <span className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                    {p.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────────────────── POPULAR FURNITURE TABS ────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Popular Furniture</h2>

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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {(activeTab === "home" ? homeProducts : officeProducts).map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col items-center"
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-40 object-contain mb-3"
                />
                <h4 className="font-medium text-center line-clamp-2">{p.title}</h4>
                <p className="text-lg font-bold mt-1">₹{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── FEATURES STRIP ────────────────── */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "feature-1.png",
              title: "Free home delivery",
              desc: "On orders over ₹10 000",
            },
            {
              icon: "feature-2.png",
              title: "Quality Products",
              desc: "Our main goal",
            },
            {
              icon: "feature-3.png",
              title: "3-Day Return",
              desc: "If you’re not happy",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-gray-100 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <img src={`/assets/images/icons/${icon}`} alt="" className="h-12 mb-4" />
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
