// src/components/ProductCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const addToCart = async () => {
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

  const orig = product.price;
  const disc = product.discount || 0;
  const priceAfter = Math.round(orig * (100 - disc) / 100);

  const imgSrc =
    Array.isArray(product.images) && product.images.length
      ? product.images[0]
      : product.imageUrl || "/assets/images/placeholder/270x290.png";

  return (
    <div className="single-grid-product bg-white rounded shadow hover:shadow-lg overflow-hidden relative">
      {disc > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-sm rounded">
          -{disc}%
        </div>
      )}
      <Link to={`/product/${product._id}`} className="block relative group">
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="overlay absolute inset-0 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 bg-black/30">
          View Details
        </div>
      </Link>

      <div className="p-4">
        <h3 className="title text-lg font-semibold mb-2">
          <Link to={`/product/${product._id}`} className="hover:text-orange-600">
            {product.title}
          </Link>
        </h3>

        {disc > 0 ? (
          <p className="product-price mb-1">
            <span className="line-through text-gray-500 mr-2">₹{orig}</span>
            <span className="text-red-500 font-semibold">₹{priceAfter}</span>
          </p>
        ) : (
          <p className="product-price mb-1 text-red-500 font-semibold">
            ₹{orig}
          </p>
        )}

        <button
          onClick={addToCart}
          className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
