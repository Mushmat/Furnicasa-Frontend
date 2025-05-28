import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* pick up any images you drop into /src/assets/hero/ */
const heroImages = Object.values(
  import.meta.glob("/src/assets/hero/*.{jpg,jpeg,png}", {
    eager: true,
    as: "url",
  })
);

/* slider arrows */
const Arrow = ({ onClick, direction }) => (
  <button
    type="button"
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
                rounded-full bg-white/60 hover:bg-white shadow z-10
                ${direction === "prev" ? "left-4" : "right-4"}`}
  >
    {direction === "prev" ? "‹" : "›"}
  </button>
);

const heroSettings = {
  autoplay: true,
  autoplaySpeed: 6000,
  infinite: true,
  arrows: true,
  slidesToShow: 1,
  prevArrow: <Arrow direction="prev" />,
  nextArrow: <Arrow direction="next" />,
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeCat, setActiveCat] = useState("");
  const navigate   = useNavigate();

  /* fetch all products once */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(({ data }) => {
        setProducts(data);
        const first = data[0]?.category || "All";
        setActiveCat(first);
      })
      .finally(() => setLoading(false));
  }, []);

  /* derived category list */
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "Uncategorized"));
    return Array.from(set);
  }, [products]);

  /* helper: link to products page with preset filter */
  const jumpToCategoryPage = (cat) =>
    navigate("/products", { state: { category: cat } });

  /* banner pair (first 2 items) */
  const bannerProducts = products.slice(0, 2);

  /* popular items for active tab (max 4) */
  const tabItems = products
    .filter((p) => p.category === activeCat)
    .slice(0, 8);

  /* render */
  if (loading) return <p className="p-8 text-center">Loading…</p>;

  return (
    <div id="main-wrapper">
      {/* HERO SLIDER */}
      <section className="hero-section relative">
        <Slider {...heroSettings}>
          {heroImages.map((src, i) => (
            <div key={i} className="relative h-[400px]">
              {/* background image */}
              <img src={src} alt="" className="w-full h-full object-cover" />

              {/* dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/40 z-10" />

              {/* slide content */}
              <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                <div className="text-center text-white">
                  <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
                    Creative Design
                    <br />
                    Modern &amp; Exclusive Furniture
                  </h2>
                  <Link
                    to="/products"
                    className="px-8 py-3 bg-white text-gray-900 rounded-full uppercase font-semibold shadow transition hover:bg-gray-100"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* GREAT DEALS BANNER PAIR */}
      {bannerProducts.length === 2 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-4">Great Deals Right Now</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {bannerProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="relative overflow-hidden rounded-lg shadow group"
                >
                  {/* discount badge */}
                  {p.discountPercent > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{p.discountPercent}%
                    </span>
                  )}

                  <img
                    src={p.imageUrl.replace("http://", "https://")}
                    alt={p.title}
                    className="w-full h-64 object-cover"
                  />
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

      {/* POPULAR BY CATEGORY */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            Popular Furniture
          </h2>

          {/* dynamic tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-6 py-2 border rounded ${
                  activeCat === cat
                    ? "border-black bg-white font-bold"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* grid */}
          {tabItems.length === 0 ? (
            <p className="text-center">No items in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {tabItems.map((p) => {
                const fp = Math.round(
                  p.price * (1 - (p.discountPercent || 0) / 100)
                );
                return (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    className="relative bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col"
                  >
                    {/* discount badge */}
                    {p.discountPercent > 0 && (
                      <span className="absolute top-2 left-2 z-10 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{p.discountPercent}%
                      </span>
                    )}

                    <img
                      src={p.imageUrl.replace("http://", "https://")}
                      alt={p.title}
                      className="w-full h-48 object-contain mb-3"
                    />

                    <h4 className="font-medium line-clamp-2 flex-1 text-center">
                      {p.title}
                    </h4>

                    {p.discountPercent > 0 ? (
                      <p className="mt-1 text-center">
                        <span className="line-through text-gray-500 mr-1">
                          ₹{p.price.toLocaleString()}
                        </span>
                        <span className="text-orange-600 font-bold">
                          ₹{fp.toLocaleString()}
                        </span>
                        <span className="ml-1 text-green-600 text-sm">
                          -{p.discountPercent}%
                        </span>
                      </p>
                    ) : (
                      <p className="text-lg font-bold mt-1 text-center">
                        ₹{p.price.toLocaleString()}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* quick link to full list */}
          <div className="mt-8 text-center">
            <button
              onClick={() => jumpToCategoryPage(activeCat)}
              className="btn"
            >
              View all {activeCat} →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
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
}
