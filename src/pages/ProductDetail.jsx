// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  Star,
  Heart,
  ChevronRight,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../components/ui/Toast";
import Tilt from "../components/ui/Tilt";
import ProductCard from "../components/ProductCard";
import { Section, SectionHeading } from "../components/ui/Section";
import { Skeleton } from "../components/ui/Skeleton";
import { Price, ProductImage, Stars, inr } from "../components/ui/Bits";
import { EASE, spring, springSnappy, viewportOnce } from "../components/ui/motion";

const MAX_QTY = 10;

const PERKS = [
  { icon: Truck, title: "Free delivery", desc: "On orders over ₹10,000" },
  { icon: ShieldCheck, title: "1-year warranty", desc: "Against manufacturing defects" },
  { icon: RefreshCw, title: "10-day replacement", desc: "For damage or defects" },
];

const fetchCart = async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const items = Array.isArray(data) ? data : data.items || [];
  dispatch({ type: "SET_CART", payload: items });
};

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { user } = useAuth();
  const { items: wishes, add, remove } = useWishlist();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [openPanel, setOpenPanel] = useState("description");

  /* reviews */
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQty(1);
    (async () => {
      try {
        const [{ data: prod }, { data: all }, { data: rev }] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`),
        ]);

        setProduct(prod);
        /* prefer the same category, fall back to anything else */
        const pool = (Array.isArray(all) ? all : []).filter((p) => p._id !== id);
        const sameCat = pool.filter((p) => p.category === prod.category);
        setRelated((sameCat.length >= 4 ? sameCat : pool).slice(0, 4));
        setReviews(Array.isArray(rev) ? rev : []);
        setError("");
      } catch {
        setError("We couldn't load this product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const wishedItem = wishes.find((i) => (i.product?._id || i?._id) === id);

  const avgRating = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0,
    [reviews]
  );

  const distribution = useMemo(() => {
    const d = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      d[r.rating] = (d[r.rating] || 0) + 1;
    });
    return d;
  }, [reviews]);

  /* ── actions ──────────────────────────────────────────── */

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Sign in to add items to your cart.");
      return navigate("/login", { state: { from: `/product/${id}` } });
    }
    if (product?.outOfStock || adding) return;

    setAdding(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: product._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(dispatch);
      setAdded(true);
      toast.cart(`${qty} × ${product.title}`, { title: "Added to cart" });
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error("Couldn't add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const toggleWish = async () => {
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
    } catch {
      toast.error("Could not update wishlist.");
    }
  };

  const changeQty = (delta) => {
    const next = qty + delta;
    if (next < 1) return;
    if (next > MAX_QTY) {
      toast.info("For orders above 10 units, please contact us directly.");
      return;
    }
    setQty(next);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Sign in to leave a review.");
      return navigate("/login");
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(5);
      setComment("");
      const { data: rev } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}/reviews`
      );
      setReviews(Array.isArray(rev) ? rev : []);
      toast.success("Thanks — your review is live.");
    } catch {
      toast.error("Could not save your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── loading / error ──────────────────────────────────── */

  if (loading) {
    return (
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-[2rem]" />
          <div className="space-y-5 py-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-x flex flex-col items-center py-32 text-center">
        <h1 className="mb-3">{error || "Product not found"}</h1>
        <p className="mb-8 text-ink-500">
          The piece you're after may have been removed.
        </p>
        <Link to="/products" className="btn-primary">
          Back to the catalogue
        </Link>
      </div>
    );
  }

  const { price, discountPercent: discount = 0, outOfStock } = product;
  const final = Math.round(price * (1 - discount / 100));
  const hasSpecs = Object.keys(product.specs || {}).length > 0;

  return (
    <div>
      {/* ── breadcrumb ── */}
      <div className="container-x pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-400">
            <li>
              <Link to="/" className="transition-colors hover:text-ink-900">
                Home
              </Link>
            </li>
            <ChevronRight size={13} />
            <li>
              <Link to="/products" className="transition-colors hover:text-ink-900">
                Shop
              </Link>
            </li>
            {product.category && (
              <>
                <ChevronRight size={13} />
                <li>
                  <Link
                    to={`/products?category=${encodeURIComponent(product.category)}`}
                    className="capitalize transition-colors hover:text-ink-900"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight size={13} />
            <li className="max-w-[16rem] truncate text-ink-800">{product.title}</li>
          </ol>
        </nav>
      </div>

      {/* ── main ── */}
      <div className="container-x grid gap-12 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <Tilt max={7} scale={1.01} perspective={1400}>
            <div className="group relative aspect-square overflow-hidden rounded-[2rem] border border-ink-100 bg-white shadow-lift">
              <ProductImage
                src={product.imageUrl}
                alt={product.title}
                loading="eager"
                className={`h-full w-full object-contain p-8 transition-transform duration-700 ease-out-expo group-hover:scale-105 ${
                  outOfStock ? "opacity-70 grayscale" : ""
                }`}
              />

              {discount > 0 && (
                <span className="absolute left-6 top-6 badge bg-clay-grad text-white shadow-glow">
                  Save {discount}%
                </span>
              )}
              {outOfStock && (
                <span className="absolute right-6 top-6 badge bg-ink-900 text-sand-50">
                  Sold out
                </span>
              )}

              {/* soft floor shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-16 bottom-6 h-8 rounded-[50%] bg-ink-900/10 blur-2xl"
              />
            </div>
          </Tilt>

          {/* perks */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-ink-100 bg-white/70 p-4 text-center"
              >
                <Icon size={18} className="mx-auto mb-2 text-clay-600" />
                <p className="text-xs font-semibold text-ink-900">{title}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-ink-400">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          {product.category && (
            <span className="eyebrow mb-4">{product.category}</span>
          )}

          <h1 className="mb-4 font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-[2.6rem]">
            {product.title}
          </h1>

          {reviews.length > 0 && (
            <button
              onClick={() =>
                document
                  .getElementById("reviews")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mb-6 flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-900"
            >
              <Stars value={avgRating} size={15} />
              <span className="font-semibold text-ink-800">
                {avgRating.toFixed(1)}
              </span>
              <span className="link-underline">
                ({reviews.length} review{reviews.length > 1 ? "s" : ""})
              </span>
            </button>
          )}

          {/* price */}
          <div className="mb-8 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-semibold text-ink-900">
              {inr(final)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-ink-400 line-through">
                  {inr(price)}
                </span>
                <span className="badge bg-jade-100 text-jade-700">
                  You save {inr(price - final)}
                </span>
              </>
            )}
          </div>

          {/* stock */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                outOfStock ? "bg-clay-600" : "animate-pulse bg-jade-500"
              }`}
            />
            <span className={outOfStock ? "text-clay-700" : "text-jade-700"}>
              {outOfStock
                ? "Currently out of stock"
                : "In stock — made to order, ships in 4–6 weeks"}
            </span>
          </div>

          {/* qty + actions */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-ink-200 bg-white p-1">
              <button
                onClick={() => changeQty(-1)}
                disabled={qty === 1}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-sand-100 disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-display text-lg font-semibold tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => changeQty(1)}
                disabled={qty === MAX_QTY}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-sand-100 disabled:opacity-30"
              >
                <Plus size={16} />
              </button>
            </div>

            <motion.button
              onClick={toggleWish}
              whileTap={{ scale: 0.9 }}
              transition={springSnappy}
              aria-label={wishedItem ? "Remove from wishlist" : "Save to wishlist"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors hover:border-clay-400 hover:text-clay-600"
            >
              <Heart
                size={19}
                className={wishedItem ? "fill-clay-600 text-clay-600" : ""}
              />
            </motion.button>
          </div>

          <motion.button
            onClick={addToCart}
            disabled={outOfStock || adding}
            whileTap={outOfStock ? undefined : { scale: 0.98 }}
            transition={spring}
            className={`mb-8 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-semibold transition-all duration-300 ${
              outOfStock
                ? "cursor-not-allowed bg-ink-100 text-ink-400"
                : added
                  ? "bg-jade-500 text-white shadow-lift"
                  : "bg-clay-grad text-white shadow-[0_10px_30px_-10px_rgba(227,91,40,.75)] hover:-translate-y-0.5"
            }`}
          >
            {outOfStock ? (
              "Currently unavailable"
            ) : added ? (
              <>
                <Check size={19} /> Added to cart
              </>
            ) : adding ? (
              "Adding…"
            ) : (
              <>
                <ShoppingBag size={19} /> Add to cart · {inr(final * qty)}
              </>
            )}
          </motion.button>

          {/* accordions */}
          <div className="divide-y divide-ink-100 border-y border-ink-100">
            {product.description && (
              <Accordion
                id="description"
                title="Description"
                open={openPanel === "description"}
                onToggle={setOpenPanel}
              >
                <p className="whitespace-pre-line leading-relaxed text-ink-600">
                  {product.description}
                </p>
              </Accordion>
            )}

            {hasSpecs && (
              <Accordion
                id="specs"
                title="Specifications"
                open={openPanel === "specs"}
                onToggle={setOpenPanel}
              >
                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between gap-4 border-b border-dashed border-ink-100 pb-2"
                    >
                      <dt className="text-sm font-medium text-ink-500">{k}</dt>
                      <dd className="text-right text-sm font-semibold text-ink-900">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
            )}

            <Accordion
              id="delivery"
              title="Delivery & returns"
              open={openPanel === "delivery"}
              onToggle={setOpenPanel}
            >
              <ul className="space-y-2 text-sm leading-relaxed text-ink-600">
                <li>• Ready items ship in 7–15 days; made-to-order pieces take 4–6 weeks.</li>
                <li>• Curb-side delivery is free across India on orders over ₹10,000.</li>
                <li>• Please check doorway and lift measurements before ordering.</li>
                <li>
                  • Full detail in our{" "}
                  <Link to="/policies" className="link-underline font-semibold text-clay-600">
                    store policies
                  </Link>
                  .
                </li>
              </ul>
            </Accordion>
          </div>
        </motion.div>
      </div>

      {/* ── reviews ── */}
      <Section tone="sand" id="reviews">
        <div className="container-x">
          <SectionHeading kicker="Reviews" title="What buyers think" align="left" />

          <div className="grid gap-12 lg:grid-cols-[22rem_1fr]">
            {/* summary + form */}
            <div className="space-y-8">
              <div className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
                {reviews.length > 0 ? (
                  <>
                    <div className="mb-5 flex items-end gap-3">
                      <span className="font-display text-5xl font-semibold leading-none text-ink-900">
                        {avgRating.toFixed(1)}
                      </span>
                      <div className="pb-1">
                        <Stars value={avgRating} size={15} />
                        <p className="mt-1 text-xs text-ink-400">
                          {reviews.length} review{reviews.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((n) => {
                        const pct = reviews.length
                          ? (distribution[n] / reviews.length) * 100
                          : 0;
                        return (
                          <div key={n} className="flex items-center gap-3 text-xs">
                            <span className="w-3 text-ink-500">{n}</span>
                            <Star size={11} className="fill-gold-400 text-gold-400" />
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${pct}%` }}
                                viewport={viewportOnce}
                                transition={{ duration: 0.8, ease: EASE }}
                                className="h-full rounded-full bg-gold-400"
                              />
                            </div>
                            <span className="w-5 text-right text-ink-400">
                              {distribution[n]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-ink-500">
                    No reviews yet — be the first to share your experience.
                  </p>
                )}
              </div>

              {/* form */}
              <form
                onSubmit={submitReview}
                className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft"
              >
                <h3 className="mb-5 font-display text-lg font-semibold">
                  Write a review
                </h3>

                <div className="mb-5">
                  <span className="label">Your rating</span>
                  <div
                    className="flex gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        whileHover={{ scale: 1.18, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={springSnappy}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        className="p-0.5"
                      >
                        <Star
                          size={26}
                          className={
                            n <= (hoverRating || rating)
                              ? "fill-gold-400 text-gold-400"
                              : "fill-ink-100 text-ink-200"
                          }
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <label className="mb-5 block">
                  <span className="label">Your review</span>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How does it look and feel in the room?"
                    className="input resize-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-ink w-full"
                >
                  {submitting ? "Posting…" : "Post review"}
                </button>
              </form>
            </div>

            {/* list */}
            <div>
              {reviews.length === 0 ? (
                <div className="flex h-full min-h-[16rem] items-center justify-center rounded-3xl border border-dashed border-ink-200 p-10 text-center">
                  <p className="text-ink-400">
                    Reviews from verified buyers will appear here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((r, i) => (
                    <motion.li
                      key={r._id || i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                      className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-sand-50">
                            {(r.name || "?").charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-ink-900">
                              {r.name || "Verified buyer"}
                            </p>
                            <p className="text-xs text-ink-400">
                              {r.createdAt
                                ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : ""}
                            </p>
                          </div>
                        </div>
                        <Stars value={r.rating} size={14} />
                      </div>
                      <p className="leading-relaxed text-ink-600">{r.comment}</p>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ── related ── */}
      {related.length > 0 && (
        <Section>
          <div className="container-x">
            <SectionHeading
              kicker="Keep looking"
              title="You might also like"
              align="left"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}

/* ── accordion ────────────────────────────────────────────── */
function Accordion({ id, title, open, onToggle, children }) {
  return (
    <div>
      <button
        onClick={() => onToggle(open ? null : id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-display text-lg font-semibold text-ink-900">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={spring}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-ink-600"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
