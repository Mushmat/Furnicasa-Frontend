// src/components/ui/Magnetic.jsx
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Element drifts toward the cursor while it is nearby, then springs back.
 * Used sparingly — hero CTAs, the cart button — so it stays a delight rather
 * than a tic.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
  as: Tag = "div",
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.5 });

  const coarse =
    typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches;

  if (reduced || coarse) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
