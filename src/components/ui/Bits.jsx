// src/components/ui/Bits.jsx
// Tiny presentational pieces reused across many pages.
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { EASE, spring } from "./motion";

/* ── money ─────────────────────────────────────────────────── */

export const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const finalPrice = (p) =>
  Math.round((p?.price || 0) * (1 - (p?.discountPercent || 0) / 100));

/** Discounted price with the struck-through original beside it. */
export function Price({
  price,
  discountPercent = 0,
  size = "md",
  invert = false,
  className = "",
}) {
  const final = Math.round(price * (1 - discountPercent / 100));
  const sizes = {
    sm: { now: "text-base", was: "text-xs" },
    md: { now: "text-lg", was: "text-sm" },
    lg: { now: "text-3xl", was: "text-base" },
  }[size];

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span
        className={`font-display font-semibold ${sizes.now} ${
          invert ? "text-sand-50" : "text-ink-900"
        }`}
      >
        {inr(final)}
      </span>
      {discountPercent > 0 && (
        <>
          <span
            className={`line-through ${sizes.was} ${
              invert ? "text-ink-300" : "text-ink-400"
            }`}
          >
            {inr(price)}
          </span>
          <span
            className={`badge ${
              invert ? "bg-jade-400/20 text-jade-200" : "bg-jade-100 text-jade-700"
            }`}
          >
            {discountPercent}% off
          </span>
        </>
      )}
    </div>
  );
}

/* ── ratings ───────────────────────────────────────────────── */

export function Stars({ value = 0, size = 15, className = "", showValue = false }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= Math.round(value)
                ? "fill-gold-400 text-gold-400"
                : "fill-ink-100 text-ink-200"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-ink-600">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}

/* ── empty states ──────────────────────────────────────────── */

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      {Icon && (
        <div className="relative mb-6">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-clay-400/25" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-clay-50 text-clay-500 ring-1 ring-clay-100">
            <Icon size={32} strokeWidth={1.6} />
          </span>
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="mb-7 max-w-sm text-ink-500">{description}</p>
      )}
      {action}
    </motion.div>
  );
}

/* ── status pill ───────────────────────────────────────────── */

const STATUS_TONES = {
  Pending: "bg-gold-400/15 text-gold-600 ring-gold-400/30",
  Packed: "bg-ink-900/10 text-ink-700 ring-ink-900/15",
  Shipped: "bg-jade-100 text-jade-700 ring-jade-300/50",
  "Out for Delivery": "bg-clay-100 text-clay-700 ring-clay-300/50",
  Paid: "bg-jade-100 text-jade-700 ring-jade-300/50",
  Delivered: "bg-jade-500 text-white ring-jade-600/30",
  Cancelled: "bg-clay-600 text-white ring-clay-700/30",
};

export function StatusPill({ status, className = "" }) {
  return (
    <span
      className={`badge ring-1 ${
        STATUS_TONES[status] || "bg-ink-100 text-ink-600 ring-ink-200"
      } ${className}`}
    >
      {status}
    </span>
  );
}

/* ── animated CTA link ─────────────────────────────────────── */

export function ArrowLink({ to, children, className = "", invert = false }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 text-sm font-semibold ${
        invert ? "text-sand-50" : "text-ink-900"
      } ${className}`}
    >
      <span className="link-underline">{children}</span>
      <motion.span
        aria-hidden
        className="inline-block"
        initial={false}
        whileHover={{ x: 4 }}
        transition={spring}
      >
        →
      </motion.span>
    </Link>
  );
}

/* ── product imagery ───────────────────────────────────────── */

const PLACEHOLDER = "/assets/images/placeholder/270x290.png";

/** Force https (the API still returns some http URLs) and fall back gracefully. */
export const safeImg = (url) =>
  url ? String(url).replace(/^http:\/\//, "https://") : PLACEHOLDER;

export function ProductImage({ src, alt, className = "", ...rest }) {
  return (
    <img
      src={safeImg(src)}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = PLACEHOLDER;
      }}
      className={className}
      {...rest}
    />
  );
}
