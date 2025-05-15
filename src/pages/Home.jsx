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
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // adjust these filters to match your product schema
  const homeProducts = products
    .filter((p) => p.category === "home")
    .slice(0, 4);
  const officeProducts = products
    .filter((p) => p.category === "office")
    .slice(0, 4);

  // Hero slider settings
  const heroSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
  };

  return (
    <div id="main-wrapper" className="pt-[128px]">
      {/* ========== Hero Slider ========== */}
      <section className="hero-section relative">
        <Slider {...heroSettings} className="hero-slider">
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
                  <Link to="/products" className="btn bg-black text-white">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ========== Banner Section (dynamic) ========== */}
      <section className="banner-section section pt-30">
        <div className="container">
          <div className="row">
            {products.slice(0, 2).map((prod, idx) => (
              <div key={prod._id} className="col-lg-6 col-md-6 col-sm-12">
                <div className="single-banner-item mb-30">
                  <div className="banner-image">
                    <Link to={`/product/${prod._id}`}>
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full"
                      />
                    </Link>
                  </div>
                  <div
                    className={
                      idx === 1 ? "banner-content tr-right" : "banner-content"
                    }
                  >
                    <h3 className="title text-2xl font-bold">{prod.title}</h3>
                    <Link
                      to={`/product/${prod._id}`}
                      className="text-orange-600"
                    >
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Popular Furniture (Tabs) ========== */}
      <section className="product-section section pt-70 pb-55">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Popular Furniture</h2>
          </div>

          <ul className="flex justify-center space-x-4 mb-8">
            {["home", "office"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border ${
                    activeTab === tab
                      ? "border-black font-bold"
                      : "border-gray-300"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(activeTab === "home" ? homeProducts : officeProducts).map(
                (prod) => (
                  <div key={prod._id} className="single-grid-product">
                    <div className="product-image mb-2">
                      <Link to={`/product/${prod._id}`}>
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-full object-contain h-48"
                        />
                      </Link>
                    </div>
                    <div className="product-content">
                      <h3 className="title">
                        <Link to={`/product/${prod._id}`}>{prod.title}</Link>
                      </h3>
                      <p className="product-price">
                        <span className="discounted-price">
                          ₹{prod.price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== Features ========== */}
      <section className="features-section section pt-30">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "feature-1.png",
              title: "Free home delivery",
              desc: "On orders over $100",
            },
            { icon: "feature-2.png", title: "Quality Products", desc: "Our main goal" },
            { icon: "feature-3.png", title: "3 Days Return", desc: "If you’re not happy" },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="single-feature text-center p-6 bg-gray-100 rounded"
            >
              <img
                src={`/assets/images/icons/${icon}`}
                alt=""
                className="mx-auto mb-4"
              />
              <h4 className="font-bold mb-2">{title}</h4>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
