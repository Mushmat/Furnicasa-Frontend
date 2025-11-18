import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const { items, add, remove } = useWishlist();
  const navigate = useNavigate();

  /* ---------- image ---------- */
  const placeholder = "/assets/images/placeholder/270x290.png";
  const imgSrc = product?.imageUrl
    ? product.imageUrl.replace("http://", "https://")
    : placeholder;

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
    if (product?.outOfStock) return;

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
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product._id}`} className="block relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imgSrc}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist button */}
          <button
            onClick={toggleWish}
            className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className="transition-colors"
              stroke="hsl(var(--accent))"
              fill={wishedItem ? "hsl(var(--accent))" : "none"}
            />
          </button>

          {/* Badges container */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {/* Discount badge */}
            {discount > 0 && (
              <span className="px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-md">
                -{discount}% OFF
              </span>
            )}

            {/* Out of stock badge */}
            {product?.outOfStock && (
              <span className="px-3 py-1.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-accent transition-colors">
          <Link to={`/product/${product._id}`}>
            {product.title}
          </Link>
        </h3>

        {/* Category (optional) */}
        {product.category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {product.category}
          </p>
        )}

        {/* Price section */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-bold text-accent">
            ₹{finalPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm line-through text-muted-foreground font-medium">
                ₹{price.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
                Save {discount}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={product?.outOfStock}
          className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            product?.outOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          }`}
        >
          {product?.outOfStock ? (
            "Unavailable"
          ) : (
            <>
              <ShoppingCart size={18} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
