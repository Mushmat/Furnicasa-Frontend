// src/components/ProductCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  /* --------------------------------------------------------------- */
  /*  helpers                                                        */
  /* --------------------------------------------------------------- */
  const { dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const imgSrc =
    Array.isArray(product.images) && product.images.length
      ? product.images[0]
      : product.imageUrl || "/assets/images/placeholder/270x290.png";

  const addToCart = async () => {
    /* must be logged-in */
    if (!user) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }

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
    }
  };

  /* --------------------------------------------------------------- */
  /*  render                                                         */
  /* --------------------------------------------------------------- */
  return (
    <div className="single-grid-product bg-white rounded shadow hover:shadow-lg overflow-hidden">
      {/* ============================================================ */}
      {/*  IMAGE + “view details” overlay                              */}
      {/* ============================================================ */}
      <div className="product-image relative group">
        <Link to={`/product/${product._id}`} className="block overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* faded text overlay */}
          <div className="overlay absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
            View Details
          </div>
        </Link>

        {/* single unobtrusive hover button */}
        <button
          onClick={addToCart}
          className="absolute bottom-3 right-3 bg-orange-600 text-white px-3 py-1 rounded text-sm opacity-0
                     group-hover:opacity-100 transition"
        >
          Add to Cart
        </button>
      </div>

      {/* ============================================================ */}
      {/*  TITLE + PRICE                                               */}
      {/* ============================================================ */}
      <div className="p-4">
        <h3 className="title text-lg font-semibold mb-2">
          <Link to={`/product/${product._id}`} className="hover:text-orange-600">
            {product.name}
          </Link>
        </h3>

        <p className="product-price">
          <span className="text-red-600 font-semibold">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="ml-2 line-through text-gray-500">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
