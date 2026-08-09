// src/components/ui/AuthLayout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { EASE } from "./motion";

const HIGHLIGHTS = [
  { icon: Truck, text: "Free delivery over ₹10,000" },
  { icon: ShieldCheck, text: "One-year warranty on every piece" },
  { icon: Sparkles, text: "Made to order in our own workshop" },
];

/**
 * Split-screen shell for every auth screen: an atmospheric brand panel on the
 * left, the form on the right. On mobile the panel collapses to a slim header
 * so the form stays above the fold.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      {/* ── brand panel ── */}
      <aside className="relative isolate hidden overflow-hidden bg-ink-950 p-12 text-sand-50 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="blob -left-24 top-0 h-[30rem] w-[30rem] animate-drift bg-clay-600/35" />
          <div
            className="blob -right-20 bottom-0 h-[26rem] w-[26rem] animate-drift bg-jade-600/25"
            style={{ animationDelay: "-9s" }}
          />
        </div>
        <div aria-hidden className="grain absolute inset-0 -z-10" />

        <Link to="/" className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-50 text-ink-950">
            <span className="font-display text-xl font-bold leading-none">F</span>
          </span>
          <span className="font-display text-2xl font-semibold">Furnicasa</span>
        </Link>

        <div className="relative max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <Quote size={30} className="mb-6 text-clay-400" />
            <blockquote className="font-display text-2xl font-medium leading-snug text-sand-50">
              “The whole ordering flow was smooth and the pieces feel genuinely
              premium — it changed how the room reads.”
            </blockquote>
            <p className="mt-6 text-sm text-ink-400">
              Meera Nair · Kochi
            </p>
          </motion.div>
        </div>

        <ul className="relative space-y-3">
          {HIGHLIGHTS.map(({ icon: Icon, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 text-sm text-ink-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Icon size={15} className="text-clay-400" />
              </span>
              {text}
            </motion.li>
          ))}
        </ul>
      </aside>

      {/* ── form panel ── */}
      <main className="flex items-center justify-center px-5 py-14 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="mb-2 font-display text-3xl font-semibold sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-ink-500">{subtitle}</p>
            )}
          </div>

          {children}

          {footer && <div className="mt-8">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}
