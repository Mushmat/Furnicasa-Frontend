// src/components/ui/PageHeader.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { EASE } from "./motion";

/**
 * The dark, softly-lit banner that opens every interior page. Replaces the old
 * flat breadcrumb.png strip: layered gradient light, drifting colour blobs, a
 * fine grid and a parallax shift as you scroll away from it.
 */
export default function PageHeader({
  title,
  kicker,
  subtitle,
  crumbs = [],
  align = "center",
  children,
  compact = false,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const centered = align === "center";

  return (
    <header
      ref={ref}
      className={`relative isolate overflow-hidden bg-ink-950 text-sand-50 ${
        compact ? "py-16 sm:py-20" : "py-24 sm:py-32"
      }`}
    >
      {/* drifting light */}
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ scale }}>
        <div className="blob -left-24 -top-24 h-[26rem] w-[26rem] animate-drift bg-clay-600/30" />
        <div
          className="blob -right-16 top-1/3 h-[22rem] w-[22rem] animate-drift bg-jade-500/25"
          style={{ animationDelay: "-7s" }}
        />
        <div
          className="blob -bottom-10 left-1/3 h-[20rem] w-[20rem] animate-drift bg-gold-500/20"
          style={{ animationDelay: "-14s" }}
        />
      </motion.div>

      {/* fine grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />

      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <motion.div
        style={{ y, opacity }}
        className={`container-x flex flex-col gap-4 ${
          centered ? "items-center text-center" : "items-start text-left"
        }`}
      >
        {kicker && (
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="eyebrow text-clay-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-clay-400" />
            {kicker}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
          className="text-4xl font-semibold text-sand-50 sm:text-6xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            className={`max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg ${
              centered ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </motion.p>
        )}

        {crumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            aria-label="Breadcrumb"
            className="mt-2"
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-300">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {c.to ? (
                    <Link to={c.to} className="link-underline hover:text-sand-50">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-sand-50">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && (
                    <span className="text-ink-500">/</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="mt-4"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}
