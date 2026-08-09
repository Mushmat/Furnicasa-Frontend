// src/components/ui/Tilt.jsx
import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

/**
 * Pointer-tracked 3D tilt with a moving specular highlight.
 *
 * The wrapper owns the perspective; the inner element does the rotating, so
 * children can opt into extra depth with `translateZ` utilities. Falls back to
 * a plain div when the visitor prefers reduced motion or is on a coarse
 * pointer (tilt on touch just looks like jitter).
 */
export default function Tilt({
  children,
  className = "",
  innerClassName = "",
  max = 9,
  scale = 1.02,
  glare = true,
  perspective = 1000,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const config = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), config);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), config);

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,.5), rgba(255,255,255,0) 55%)`;

  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: none)").matches;

  if (reduced || coarse) {
    return (
      <div className={className} {...rest}>
        <div className={innerClassName}>{children}</div>
      </div>
    );
  }

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      <motion.div
        className={`relative h-full ${innerClassName}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {children}

        {glare && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glareBg, mixBlendMode: "soft-light" }}
          />
        )}
      </motion.div>
    </div>
  );
}
