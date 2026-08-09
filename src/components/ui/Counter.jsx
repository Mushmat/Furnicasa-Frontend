// src/components/ui/Counter.jsx
import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Counts up to `value` the first time it scrolls into view. */
export default function Counter({
  value = 0,
  duration = 1600,
  prefix = "",
  suffix = "",
  className = "",
  format = (n) => n.toLocaleString("en-IN"),
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setDisplay(value);

    let frame;
    const start = performance.now();
    // easeOutExpo — fast out of the gate, settles gently on the final number
    const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * ease(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(display)}
      {suffix}
    </span>
  );
}
