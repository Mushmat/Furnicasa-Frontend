// src/pages/Home.jsx
import React, { useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  // — Hero slider settings
  const heroSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
  };

  // — Testimonial slider settings
  const testimonialSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    slidesToShow: 1,
  };

  // — Brand slider settings
  const brandSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 5,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768,  settings: { slidesToShow: 3 } },
      { breakpoint: 480,  settings: { slidesToShow: 2 } },
    ],
  };

  // — Tab state for “Popular Furniture”
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div id="main-wrapper" className="pt-[128px]">  
      {/* ================= Hero Slider ================= */}
      <section className="hero-section relative">
      <Slider {...heroSettings} className="hero-slider">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="hero-item bg-image"
              style={{
                backgroundImage: `url(/assets/images/hero/hero-${i}.jpg)`,
              }}
            >
              <div className="container">
                <div className="hero-content-2 center">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Creative Design<br />
                    Modern & Exclusive Furniture
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

      {/* ================= Banner Section ================= */}
      <section className="banner-section section pt-30">
        <div className="container">
          <div className="row">
            {[
              { img: "banner1.jpg", title: "OFFICE\nFURNITURE" },
              { img: "banner2.jpg", title: "HOME\nFURNITURE", align: "tr-right" },
            ].map(({ img, title, align }, idx) => (
              <div key={idx} className="col-lg-6 col-md-6 col-sm-12">
                <div className="single-banner-item mb-30">
                  <div className="banner-image">
                    <Link to="/products">
                      <img
                        src={`/assets/images/banner/${img}`}
                        alt=""
                        className="w-full"
                      />
                    </Link>
                  </div>
                  <div className={`banner-content ${align || ""}`}>
                    <h3 className="title text-2xl font-bold whitespace-pre-line">
                      {title}
                    </h3>
                    <Link to="/products" className="text-orange-600">
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================ Popular Furniture (Tabs) ================ */}
      <section className="product-section section pt-70 pb-55">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Popular Furniture</h2>
          </div>

          {/* Tab Buttons */}
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

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "home" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="single-grid-product">
                    <div className="product-image mb-2">
                      <Link to={`/product/${i}`}>
                        <img
                          src={`/assets/images/product/product-${i}.jpg`}
                          alt=""
                          className="w-full"
                        />
                      </Link>
                    </div>
                    <div className="product-content">
                      <h3 className="title">
                        <Link to={`/product/${i}`}>Product Name {i}</Link>
                      </h3>
                      <p className="product-price">
                        <span className="discounted-price">$100.00</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "office" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[5, 6, 7, 8].map((i) => (
                  <div key={i} className="single-grid-product">
                    <div className="product-image mb-2">
                      <Link to={`/product/${i}`}>
                        <img
                          src={`/assets/images/product/product-${i}.jpg`}
                          alt=""
                          className="w-full"
                        />
                      </Link>
                    </div>
                    <div className="product-content">
                      <h3 className="title">
                        <Link to={`/product/${i}`}>Office Item {i}</Link>
                      </h3>
                      <p className="product-price">
                        <span className="discounted-price">$150.00</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="features-section section pt-30">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "feature-1.png", title: "Free home delivery", desc: "On orders over $100" },
            { icon: "feature-2.png", title: "Quality Products", desc: "Our main goal" },
            { icon: "feature-3.png", title: "3 Days Return", desc: "If you’re not happy" },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="single-feature text-center p-6 bg-gray-100 rounded">
              <img src={`/assets/images/icons/${icon}`} alt="" className="mx-auto mb-4" />
              <h4 className="font-bold mb-2">{title}</h4>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Blog ================= */}
      <section className="blog-section section pt-65 pb-65">
        <div className="container">
          <div className="section-title text-center mb-8">
            <h2 className="text-3xl font-bold">Latest Post From Blog</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="blog-inner bg-white rounded shadow">
                <Link to="/blog-details">
                  <img
                    src={`/assets/images/blog/blog-${i}.jpg`}
                    alt=""
                    className="w-full rounded-t"
                  />
                </Link>
                <div className="p-4">
                  <ul className="meta flex space-x-2 text-sm text-gray-500 mb-2">
                    <li>0{i} April, 2025</li>
                    <li>{20 + i} Likes</li>
                    <li>{10 + i * 3} Views</li>
                  </ul>
                  <h3 className="title mb-2">
                    <Link to="/blog-details">Blog Post Title {i}</Link>
                  </h3>
                  <Link to="/blog-details" className="text-orange-600">
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Testimonial ================= */}
      <section className="testimonial-section section pb-80">
        <div className="container">
          <div className="testimonial-wrap bg-gray-100 p-8 rounded">
            <Slider {...testimonialSettings} className="testimonial-slider">
              {[1, 2].map((i) => (
                <div key={i} className="item flex space-x-6 items-center">
                  <img
                    src={`/assets/images/testimonial/testimonial-${i}.png`}
                    alt=""
                    className="w-1/3 rounded"
                  />
                  <blockquote className="text-gray-700 italic">
                    “I am very much happy to buy product from Furnicasa… quality is very satisfactory.”
                    <cite className="block font-bold mt-2">Customer {i}</cite>
                  </blockquote>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* ================= Brand Carousel ================= */}
      <section className="brand-section section pb-100">
        <div className="container">
          <Slider {...brandSettings} className="brand-slider flex items-center space-x-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="single-brand p-4">
                <img
                  src={`/assets/images/brands/brand-${(i % 5) + 1}.png`}
                  alt=""
                  className="mx-auto"
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ================= Newsletter ================= */}
      <section className="newsletter-section section bg-gray-two pt-20 pb-20">
        <div className="container grid grid-cols-1 md:grid-cols-2 items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Subscribe Our Newsletter</h2>
            <p>Subscribe Today for free and save 10% on your first purchase.</p>
          </div>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter Your Email Address Here..."
              required
              className="flex-grow px-4 py-2 border rounded-l"
            />
            <button type="submit" className="btn bg-black text-white rounded-r px-6">
              SUBSCRIBE!
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
