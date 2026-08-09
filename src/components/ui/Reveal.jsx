// src/components/ui/Reveal.jsx
import React from "react";
import { motion } from "framer-motion";
import { EASE, viewportOnce } from "./motion";

const OFFSETS = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance. Wrap anything that should arrive as the user
 * reaches it. `depth` adds a subtle 3D rotation so the element lifts off the
 * page rather than merely fading.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  depth = false,
  className = "",
  as = "div",
  ...rest
}) {
  const offset = OFFSETS[direction] ?? OFFSETS.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{
        opacity: 0,
        ...offset,
        ...(depth ? { rotateX: -10, transformPerspective: 1200 } : null),
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, ...(depth ? { rotateX: 0 } : null) }}
      viewport={viewportOnce}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** Reveals children one after another. Pair with <RevealItem>. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
  ...rest
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", y = 28, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
