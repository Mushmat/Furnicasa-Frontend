// src/components/ProductCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const { dispatch }           = useCart();
  const { user }               = useAuth();
  const { items, add, remove } = useWishlist();
  const navigate               = useNavigate();

  /* ---------- image ---------- */
  const placeholder = "/assets/images/placeholder/270x290.png";
  const imgSrc =
    product?.imageUrl ? product.imageUrl.replace("http://", "https://") : placeholder;

  /* ---------- pricing ---------- */
  const { price, discountPercent: discount = 0 } = product;
  const finalPrice = Math.round(price * (1 - discount / 100));

  /* ---------- wishlist status ---------- */
  const wishedItem = items.find(
    (i) => (i.product?._id || i?._id) === product._id
  );

  /* ---------- handlers ---------- */
  const addToCart = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });
    } catch (err) {
      console.error(err);
      alert("Could not add to cart, please try again.");
    }
  };

  const toggleWish = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    try {
      wishedItem ? await remove(wishedItem._id) : await add(product);
    } catch (err) {
      console.error(err);
      alert("Could not update wishlist");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="single-grid-product bg-white rounded shadow hover:shadow-lg">
      <Link to={`/product/${product._id}`} className="block relative group">
        {/* ♥ button */}
        <button
          onClick={toggleWish}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition"
        >
          <Heart size={20} stroke="#e11d48" fill={wishedItem ? "#e11d48" : "none"} />
        </button>

        {/* discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* product image */}
        <img src={imgSrc} alt={product.title} className="w-full h-72 object-cover rounded-t" />
      </Link>

      {/* details */}
      <div className="p-4 flex flex-col items-center text-center">
        {/* price first — made bigger */}
        <p className="mb-1 text-lg font-extrabold text-red-600">
          ₹{finalPrice.toLocaleString()}
          {discount > 0 && (
            <>
              <span className="line-through text-xs text-gray-500 ml-2 font-normal">
                ₹{price.toLocaleString()}
              </span>
              <span className="ml-1 text-green-600 text-xs">-{discount}%</span>
            </>
          )}
        </p>

        {/* title below price — smaller font */}
        <h3 className="line-clamp-2 text-sm font-medium mb-2">
          <Link to={`/product/${product._id}`} className="hover:text-orange-600">
            {product.title}
          </Link>
        </h3>

        <button
          onClick={addToCart}
          className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
