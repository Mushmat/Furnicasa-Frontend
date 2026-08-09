// src/pages/Wishlist.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, X, ArrowRight } from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/Toast";
import PageHeader from "../components/ui/PageHeader";
import Tilt from "../components/ui/Tilt";
import { EmptyState, Price, ProductImage } from "../components/ui/Bits";
import { EASE, springSnappy } from "../components/ui/motion";

export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { dispatch } = useCart();
  const toast = useToast();
  const [busy, setBusy] = useState(null);

  const moveToCart = async (wish) => {
    setBusy(wish._id);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: wish.product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "ADD", payload: { product: wish.product, quantity: 1 } });
      toast.cart(wish.product.title, { title: "Added to cart" });
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const drop = async (wish) => {
    try {
      await remove(wish._id);
      toast.info("Removed from wishlist");
    } catch {
      toast.error("Could not update your wishlist.");
    }
  };

  return (
    <div>
      <PageHeader
        kicker="Saved for later"
        title="My wishlist"
        subtitle={
          items.length
            ? `${items.length} ${items.length === 1 ? "piece" : "pieces"} you're keeping an eye on`
            : undefined
        }
        crumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
        compact
      />

      <div className="container-x py-14">
        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any product and it'll be waiting for you here."
            action={
              <Link to="/products" className="btn-primary btn-lg">
                Find something you love
                <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((wish, i) => {
                const p = wish.product;
                if (!p) return null;

                return (
                  <motion.div
                    key={wish._id}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 7) * 0.05 }}
                  >
                    <Tilt max={7} scale={1.015} className="h-full" innerClassName="h-full">
                      <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-shadow hover:shadow-lift">
                        <motion.button
                          onClick={() => drop(wish)}
                          whileTap={{ scale: 0.85 }}
                          transition={springSnappy}
                          aria-label={`Remove ${p.title} from wishlist`}
                          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-500 shadow-soft backdrop-blur transition-colors hover:bg-clay-600 hover:text-white"
                        >
                          <X size={16} />
                        </motion.button>

                        <Link
                          to={`/product/${p._id}`}
                          className="relative aspect-[4/5] overflow-hidden bg-sand-100"
                        >
                          <ProductImage
                            src={p.imageUrl}
                            alt={p.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
                          />
                          {p.discountPercent > 0 && (
                            <span className="absolute left-3 top-3 badge bg-clay-grad text-white">
                              −{p.discountPercent}%
                            </span>
                          )}
                        </Link>

                        <div className="flex flex-1 flex-col gap-3 p-5">
                          {p.category && (
                            <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                              {p.category}
                            </span>
                          )}

                          <Link
                            to={`/product/${p._id}`}
                            className="line-clamp-2-safe font-display text-[15px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-clay-700"
                          >
                            {p.title}
                          </Link>

                          <Price
                            price={p.price}
                            discountPercent={p.discountPercent || 0}
                            className="mt-auto"
                          />

                          <button
                            onClick={() => moveToCart(wish)}
                            disabled={busy === wish._id || p.outOfStock}
                            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors ${
                              p.outOfStock
                                ? "cursor-not-allowed bg-ink-100 text-ink-400"
                                : "bg-ink-900 text-sand-50 hover:bg-clay-600"
                            }`}
                          >
                            <ShoppingBag size={16} />
                            {p.outOfStock
                              ? "Unavailable"
                              : busy === wish._id
                                ? "Adding…"
                                : "Move to cart"}
                          </button>
                        </div>
                      </div>
                    </Tilt>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
