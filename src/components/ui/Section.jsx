// src/components/ui/Section.jsx
import React from "react";
import { motion } from "framer-motion";
import { EASE, viewportOnce } from "./motion";

/** Consistent vertical rhythm + optional tinted background for page sections. */
export function Section({
  children,
  className = "",
  tone = "default", // default | sand | ink | white
  size = "md", // sm | md | lg
  id,
}) {
  const tones = {
    default: "",
    sand: "bg-sand-100",
    white: "bg-white",
    ink: "bg-ink-950 text-sand-100",
  };
  const sizes = {
    sm: "py-12 sm:py-16",
    md: "py-16 sm:py-24",
    lg: "py-24 sm:py-32",
  };

  return (
    <section
      id={id}
      className={`relative ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Section title block. The heading words rise individually so a scroll down the
 * homepage feels choreographed rather than uniformly faded.
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  invert = false,
  action,
}) {
  const centered = align === "center";
  const words = String(title).split(" ");

  return (
    <div
      className={`mb-12 flex flex-col gap-4 ${
        centered ? "items-center text-center" : "items-start text-left"
      } ${action ? "sm:mb-14 sm:flex-row sm:items-end sm:justify-between" : ""}`}
    >
      <div className={`flex flex-col gap-3 ${centered && !action ? "items-center" : "items-start"}`}>
        {kicker && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5, ease: EASE }}
            className={`eyebrow ${invert ? "text-clay-300" : "text-clay-600"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {kicker}
          </motion.span>
        )}

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className={`max-w-3xl text-3xl font-semibold sm:text-[2.6rem] sm:leading-[1.12] ${
            invert ? "text-sand-50" : "text-ink-900"
          }`}
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "105%", opacity: 0 },
                  show: {
                    y: "0%",
                    opacity: 1,
                    transition: { duration: 0.65, ease: EASE },
                  },
                }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className={`max-w-2xl text-base leading-relaxed ${
              invert ? "text-ink-300" : "text-ink-500"
            }`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}

export default Section;
