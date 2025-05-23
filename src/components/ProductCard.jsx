import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const { dispatch }            = useCart();
  const { user }                = useAuth();
  const { items, add, remove }  = useWishlist();
  const navigate                = useNavigate();

  /* secure image url */
  const imgSrc = (
    product.imageUrl || "/assets/images/placeholder/270x290.png"
  ).replace("http://", "https://");

  /* pricing */
  const { price, discountPercent: discount = 0 } = product;
  const finalPrice = Math.round(price * (1 - discount / 100));

  /* wished already?  (backend returns populated product) */
  const wishedItem = items.find((i) => i.product._id === product._id);

  /* cart */
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
    } catch {
      alert("Could not add to cart, please try again.");
    }
  };

  /* wish / unwish */
  const toggleWish = async (e) => {
    e.preventDefault();               // stop <Link>
    if (!user) return navigate("/login");

    wishedItem ? await remove(wishedItem._id) : await add(product);
  };

  return (
    <div className="single-grid-product bg-white rounded shadow hover:shadow-lg">
      <Link to={`/product/${product._id}`} className="block relative group">
        {/* ♥ overlay */}
        <button
          onClick={toggleWish}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition"
        >
          <Heart
            size={20}
            fill={wishedItem ? "#e11d48" : "none"}
            stroke="#e11d48"
          />
        </button>

        {/* discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-64 object-cover rounded-t"
        />
      </Link>

      {/* details */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold mb-2">
          <Link to={`/product/${product._id}`} className="hover:text-orange-600">
            {product.title}
          </Link>
        </h3>

        <p className="mb-1">
          {discount > 0 && (
            <span className="line-through text-gray-500 mr-1">
              ₹{price.toLocaleString()}
            </span>
          )}
          <span className="text-red-500 font-semibold">
            ₹{finalPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="ml-1 text-green-600 text-sm">-{discount}%</span>
          )}
        </p>

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
