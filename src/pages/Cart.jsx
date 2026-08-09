// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  ShieldCheck,
  ArrowRight,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/Toast";
import PageHeader from "../components/ui/PageHeader";
import { EmptyState, ProductImage, inr } from "../components/ui/Bits";
import { EASE, spring, springSnappy } from "../components/ui/motion";

const COUPONS = { FIRST10: 10, BUMPER15: 15 };
const FREE_SHIPPING_AT = 10000;

export default function Cart() {
  const { cartItems, dispatch } = useCart();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const priceAfterDisc = (p) =>
    Math.round(p.price * (1 - (p.discountPercent || 0) / 100));

  /* ── mutations ────────────────────────────────────────── */

  const remove = async (id) => {
    setBusyId(id);
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });
      toast.info("Removed from cart");
    } catch (err) {
      console.error(err);
      toast.error("Could not remove that item.");
    } finally {
      setBusyId(null);
    }
  };

  const updateQty = async (id, q) => {
    if (q < 1) return;
    setBusyId(id);
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update/${id}`,
        { newQuantity: q },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "SET_CART", payload: data });
    } catch (err) {
      console.error(err);
      toast.error("Could not update the quantity.");
    } finally {
      setBusyId(null);
    }
  };

  /* ── totals ───────────────────────────────────────────── */

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + priceAfterDisc(item.product) * item.quantity,
        0
      ),
    [cartItems]
  );

  const itemCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const discountAmt = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = subtotal - discountAmt;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_AT - grandTotal);
  const shippingProgress = Math.min(100, (grandTotal / FREE_SHIPPING_AT) * 100);

  const apply = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setDiscountPercent(COUPONS[code]);
      setCouponError("");
      toast.success(`${code} applied — ${COUPONS[code]}% off`);
    } else {
      setDiscountPercent(0);
      setCouponError("That code isn't valid.");
    }
  };

  /* ── empty ────────────────────────────────────────────── */

  if (!cartItems.length) {
    return (
      <div>
        <PageHeader
          kicker="Your bag"
          title="Shopping cart"
          crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
          compact
        />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Once you add a piece it'll show up here, ready for checkout."
          action={
            <Link to="/products" className="btn-primary btn-lg">
              Browse the catalogue
              <ArrowRight size={16} />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Your bag"
        title="Shopping cart"
        subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"} ready to go`}
        crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
        compact
      />

      <div className="container-x py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_23rem]">
          {/* ── line items ── */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => {
                const p = item.product;
                const unit = priceAfterDisc(p);
                const busy = busyId === p._id;

                return (
                  <motion.article
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: busy ? 0.55 : 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex flex-col gap-5 rounded-3xl border border-ink-100 bg-white p-5 shadow-soft transition-shadow hover:shadow-card sm:flex-row sm:items-center"
                  >
                    <Link
                      to={`/product/${p._id}`}
                      className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-sand-100"
                    >
                      <ProductImage
                        src={p.imageUrl}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      {p.category && (
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                          {p.category}
                        </p>
                      )}
                      <Link
                        to={`/product/${p._id}`}
                        className="line-clamp-2-safe font-display text-lg font-semibold text-ink-900 transition-colors hover:text-clay-700"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink-500">
                        {inr(unit)} each
                        {p.discountPercent > 0 && (
                          <span className="ml-2 text-xs text-jade-600">
                            ({p.discountPercent}% off)
                          </span>
                        )}
                      </p>
                    </div>

                    {/* qty */}
                    <div className="flex items-center rounded-full border border-ink-200 p-1">
                      <button
                        onClick={() => updateQty(p._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || busy}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-sand-100 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(p._id, item.quantity + 1)}
                        disabled={busy}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-sand-100 disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* line total */}
                    <div className="text-right sm:w-28">
                      <motion.p
                        key={unit * item.quantity}
                        initial={{ scale: 1.15, color: "#E35B28" }}
                        animate={{ scale: 1, color: "#181513" }}
                        transition={{ duration: 0.4 }}
                        className="font-display text-lg font-semibold"
                      >
                        {inr(unit * item.quantity)}
                      </motion.p>
                    </div>

                    <motion.button
                      onClick={() => remove(p._id)}
                      disabled={busy}
                      whileTap={{ scale: 0.85 }}
                      transition={springSnappy}
                      aria-label={`Remove ${p.title}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
                    >
                      <Trash2 size={17} />
                    </motion.button>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-ink-600 transition-colors hover:text-clay-600"
            >
              ← Continue shopping
            </Link>
          </div>

          {/* ── summary ── */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="space-y-4">
              {/* free-shipping meter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft"
              >
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <Truck size={16} className="text-clay-600" />
                  {toFreeShipping > 0 ? (
                    <span className="text-ink-600">
                      Add{" "}
                      <strong className="text-ink-900">{inr(toFreeShipping)}</strong>{" "}
                      for free delivery
                    </span>
                  ) : (
                    <span className="font-semibold text-jade-700">
                      Free delivery unlocked
                    </span>
                  )}
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className={`h-full rounded-full ${
                      toFreeShipping > 0 ? "bg-clay-grad" : "bg-jade-500"
                    }`}
                  />
                </div>
              </motion.div>

              {/* coupon */}
              <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
                <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold">
                  <Tag size={16} className="text-clay-600" />
                  Have a coupon?
                </h3>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && apply()}
                    placeholder="Enter code"
                    className="input py-2.5 text-sm uppercase"
                    aria-label="Coupon code"
                  />
                  <button onClick={apply} className="btn-ink btn-sm shrink-0 px-5">
                    Apply
                  </button>
                </div>

                <AnimatePresence>
                  {couponError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 text-xs text-clay-600"
                    >
                      {couponError}
                    </motion.p>
                  )}
                  {discountPercent > 0 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 text-xs font-semibold text-jade-700"
                    >
                      {discountPercent}% discount applied
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* totals */}
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
                <div className="space-y-3 p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold">
                    Order summary
                  </h3>

                  <Row label={`Subtotal (${itemCount} items)`} value={inr(subtotal)} />
                  {discountPercent > 0 && (
                    <Row
                      label={`Coupon (${discountPercent}%)`}
                      value={`− ${inr(discountAmt)}`}
                      tone="jade"
                    />
                  )}
                  <Row
                    label="Delivery"
                    value={toFreeShipping > 0 ? "Calculated at checkout" : "Free"}
                    tone={toFreeShipping > 0 ? "muted" : "jade"}
                  />

                  <div className="hairline my-4" />

                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-lg font-semibold text-ink-900">
                      Total
                    </span>
                    <motion.span
                      key={grandTotal}
                      initial={{ scale: 1.08, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={spring}
                      className="font-display text-2xl font-semibold text-ink-900"
                    >
                      {inr(grandTotal)}
                    </motion.span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  state={{ discountPercent }}
                  className="group flex items-center justify-center gap-2 bg-clay-grad py-4 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  Proceed to checkout
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <p className="flex items-center justify-center gap-2 text-xs text-ink-400">
                <ShieldCheck size={14} />
                Secure payment via Razorpay
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, tone = "default" }) {
  const tones = {
    default: "text-ink-900",
    jade: "text-jade-700",
    muted: "text-ink-400",
  };
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`font-semibold ${tones[tone]}`}>{value}</span>
    </div>
  );
}
