// src/pages/OrderConfirmation.jsx
import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Package, Truck, Home, ArrowRight, Copy } from "lucide-react";

import { useToast } from "../components/ui/Toast";
import { inr } from "../components/ui/Bits";
import { EASE, spring } from "../components/ui/motion";

const CONFETTI_COLORS = ["#E35B28", "#EE7C4C", "#3E7D64", "#CE9A3D", "#F0EADF"];

/* lightweight confetti — no dependency, purely decorative */
function Confetti() {
  const reduced = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.8,
        rotate: Math.random() * 720 - 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 7,
      })),
    []
  );

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
          }}
          className="absolute top-0 rounded-[2px]"
        />
      ))}
    </div>
  );
}

const NEXT_STEPS = [
  {
    icon: Package,
    title: "We start building",
    desc: "Your pieces enter the workshop queue within 24 hours.",
  },
  {
    icon: Truck,
    title: "Dispatch & tracking",
    desc: "You'll get an SMS with tracking once it leaves our warehouse.",
  },
  {
    icon: Home,
    title: "Delivered to you",
    desc: "Expect delivery in roughly 4–6 weeks for made-to-order items.",
  },
];

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { orderId, totalPrice } = state || {};

  useEffect(() => {
    if (!orderId) navigate("/");
  }, [orderId, navigate]);

  if (!orderId) return null;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied");
    } catch {
      toast.error("Couldn't copy — please select it manually.");
    }
  };

  return (
    <div className="relative isolate overflow-hidden">
      {/* ambient */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="blob -left-32 top-0 h-[28rem] w-[28rem] animate-drift bg-jade-200/50" />
        <div
          className="blob -right-24 top-1/3 h-[24rem] w-[24rem] animate-drift bg-clay-200/50"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <Confetti />

      <div className="container-tight py-20 sm:py-28">
        {/* tick */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-jade-500 text-white shadow-[0_16px_40px_-12px_rgba(62,125,100,.8)]"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, ...spring }}
          >
            <Check size={38} strokeWidth={3} />
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="text-center"
        >
          <p className="eyebrow mb-4 justify-center">Order confirmed</p>
          <h1 className="mb-4 font-display text-4xl font-semibold sm:text-5xl">
            Thank you for your purchase
          </h1>
          <p className="mx-auto mb-12 max-w-lg text-lg text-ink-500">
            We've received your order and the workshop is on it. A confirmation
            email is on its way.
          </p>
        </motion.div>

        {/* receipt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
          className="mb-12 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card"
        >
          <div className="grid divide-ink-100 sm:grid-cols-3 sm:divide-x">
            <div className="p-6">
              <p className="label mb-2">Order ID</p>
              <button
                onClick={copyId}
                className="group flex items-center gap-2 font-mono text-sm font-semibold text-ink-900"
              >
                <span className="truncate">{orderId}</span>
                <Copy
                  size={13}
                  className="shrink-0 text-ink-400 transition-colors group-hover:text-clay-600"
                />
              </button>
            </div>

            <div className="border-t border-ink-100 p-6 sm:border-t-0">
              <p className="label mb-2">Total paid</p>
              <p className="font-display text-xl font-semibold text-ink-900">
                {inr(totalPrice)}
              </p>
            </div>

            <div className="border-t border-ink-100 p-6 sm:border-t-0">
              <p className="label mb-2">Expected delivery</p>
              <p className="font-display text-xl font-semibold text-ink-900">
                4–6 weeks
              </p>
            </div>
          </div>
        </motion.div>

        {/* what happens next */}
        <div className="mb-14 grid gap-5 sm:grid-cols-3">
          {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 + i * 0.1 }}
              className="rounded-3xl border border-ink-100 bg-white/70 p-6"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-sand-50">
                <Icon size={19} strokeWidth={1.8} />
              </span>
              <h3 className="mb-1.5 font-display text-base font-semibold">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-500">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/products" className="btn-primary btn-lg">
            Continue shopping
            <ArrowRight size={16} />
          </Link>
          <Link to="/my-account#orders" className="btn-outline btn-lg">
            Track this order
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
