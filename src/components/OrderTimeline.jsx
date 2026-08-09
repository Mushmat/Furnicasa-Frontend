// src/components/OrderTimeline.jsx
import React from "react";
import { motion } from "framer-motion";
import { Check, Package, Truck, MapPin, Home, XCircle } from "lucide-react";
import { EASE, viewportOnce } from "./ui/motion";

const STEPS = [
  { label: "Order Placed", icon: Package, offset: 0 },
  { label: "Shipped", icon: Truck, offset: 21 },
  { label: "Out for Delivery", icon: MapPin, offset: 25 },
  { label: "Delivered", icon: Home, offset: 26 },
];

/* "Paid" and "Packed" both sit at the first milestone */
const ALIASES = { paid: 0, pending: 0, packed: 0 };

const formatDate = (dateStr, addDays = 0) =>
  new Date(new Date(dateStr).getTime() + addDays * 86400000).toLocaleDateString(
    "en-IN",
    { day: "2-digit", month: "short" }
  );

export default function OrderTimeline({ status, placedDate }) {
  if (status === "Cancelled") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-clay-50 px-5 py-4 text-sm font-semibold text-clay-700">
        <XCircle size={18} />
        This order was cancelled
      </div>
    );
  }

  const key = String(status || "").toLowerCase();
  const matched = STEPS.findIndex((s) => s.label.toLowerCase() === key);
  const current = matched >= 0 ? matched : (ALIASES[key] ?? 0);

  const progress = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="mt-8">
      <div className="relative">
        {/* rail */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-ink-100" />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: progress / 100 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE }}
          style={{ transformOrigin: "left" }}
          className="absolute left-0 right-0 top-5 h-0.5 bg-jade-500"
        />

        {/* steps */}
        <ol className="relative flex justify-between">
          {STEPS.map((step, i) => {
            const done = i <= current;
            const isCurrent = i === current;
            const Icon = step.icon;

            return (
              <li
                key={step.label}
                className="flex flex-1 flex-col items-center text-center first:items-start last:items-end"
              >
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.12 }}
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white ${
                    done ? "bg-jade-500 text-white" : "bg-ink-100 text-ink-400"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-jade-500/40" />
                  )}
                  {i < current ? <Check size={17} /> : <Icon size={16} />}
                </motion.span>

                <p
                  className={`mt-3 max-w-[6.5rem] text-xs font-semibold leading-tight ${
                    done ? "text-ink-900" : "text-ink-400"
                  }`}
                >
                  {step.label}
                </p>

                {placedDate && (
                  <p className="mt-1 text-[11px] text-ink-400">
                    {formatDate(placedDate, step.offset)}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
