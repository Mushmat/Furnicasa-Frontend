// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "./ui/Toast";
import Tilt from "./ui/Tilt";
import { Price, ProductImage } from "./ui/Bits";
import { EASE, spring, springSnappy } from "./ui/motion";

export default function ProductCard({ product, index = 0 }) {
  const { dispatch } = useCart();
  const { user } = useAuth();
  const { items, add, remove } = useWishlist();
  const navigate = useNavigate();
  const toast = useToast();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { price, discountPercent: discount = 0, outOfStock } = product;

  const wishedItem = items.find(
    (i) => (i.product?._id || i?._id) === product._id
  );

  /* ── handlers ─────────────────────────────────────────── */

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Sign in to start a cart.");
      return navigate("/login");
    }
    if (outOfStock || adding) return;

    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });

      setAdded(true);
      toast.cart(product.title, { title: "Added to cart" });
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const toggleWish = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Sign in to save favourites.");
      return navigate("/login");
    }

    try {
      if (wishedItem) {
        await remove(wishedItem._id);
        toast.info("Removed from wishlist");
      } else {
        await add(product);
        toast.success("Saved to your wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update wishlist.");
    }
  };

  /* ── render ───────────────────────────────────────────── */

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index, 7) * 0.06 }}
    >
      <Tilt max={7} scale={1.015} className="h-full" innerClassName="h-full">
        <Link
          to={`/product/${product._id}`}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-shadow duration-500 hover:shadow-lift"
        >
          {/* ── image ── */}
          <div className="relative aspect-[4/5] overflow-hidden bg-sand-100">
            <ProductImage
              src={product.imageUrl}
              alt={product.title}
              className={`h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07] ${
                outOfStock ? "opacity-60 grayscale" : ""
              }`}
            />

            {/* darkening veil that reveals the quick actions */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-ink-950/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
              {discount > 0 && (
                <span className="badge bg-clay-grad text-white shadow-[0_4px_14px_-4px_rgba(227,91,40,.8)]">
                  −{discount}%
                </span>
              )}
              {outOfStock && (
                <span className="badge bg-ink-900 text-sand-50">Sold out</span>
              )}
            </div>

            {/* wishlist */}
            <motion.button
              onClick={toggleWish}
              whileTap={{ scale: 0.82 }}
              transition={springSnappy}
              aria-label={wishedItem ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-600 shadow-soft backdrop-blur transition-all duration-300 hover:bg-white hover:text-clay-600 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
            >
              <motion.span
                key={wishedItem ? "on" : "off"}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={springSnappy}
              >
                <Heart
                  size={17}
                  className={wishedItem ? "fill-clay-600 text-clay-600" : ""}
                />
              </motion.span>
            </motion.button>

            {/* quick view hint */}
            <span className="pointer-events-none absolute bottom-3 left-3 z-10 flex translate-y-3 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-ink-800 opacity-0 shadow-soft backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Eye size={13} />
              View details
            </span>
          </div>

          {/* ── body ── */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            {product.category && (
              <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                {product.category}
              </span>
            )}

            <h3 className="line-clamp-2-safe font-display text-[15px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-clay-700">
              {product.title}
            </h3>

            <Price
              price={price}
              discountPercent={discount}
              size="md"
              className="mt-auto"
            />

            <motion.button
              onClick={addToCart}
              disabled={outOfStock || adding}
              whileTap={outOfStock ? undefined : { scale: 0.97 }}
              transition={spring}
              className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 ${
                outOfStock
                  ? "cursor-not-allowed bg-ink-100 text-ink-400"
                  : added
                    ? "bg-jade-500 text-white"
                    : "bg-ink-900 text-sand-50 hover:bg-clay-600"
              }`}
            >
              {outOfStock ? (
                "Unavailable"
              ) : added ? (
                <>
                  <Check size={16} /> Added
                </>
              ) : adding ? (
                "Adding…"
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to cart
                </>
              )}
            </motion.button>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}
