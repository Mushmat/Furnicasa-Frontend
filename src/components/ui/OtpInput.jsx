// src/components/ui/OtpInput.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { springSnappy } from "./motion";

/**
 * Six separate boxes that behave like one field: typing advances, backspace
 * retreats, arrow keys move, and a pasted code fills every box at once.
 */
export default function OtpInput({ value, onChange, length = 6, autoFocus = true }) {
  const refs = useRef([]);
  const chars = value.padEnd(length).slice(0, length).split("");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setCharAt = (i, char) => {
    const next = value.padEnd(length).split("");
    next[i] = char;
    onChange(next.join("").trimEnd());
  };

  const handleChange = (i, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    setCharAt(i, digit);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (chars[i]?.trim()) {
        setCharAt(i, " ");
      } else if (i > 0) {
        setCharAt(i - 1, " ");
        refs.current[i - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    e.preventDefault();
    onChange(digits);
    refs.current[Math.min(digits.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => {
        const filled = Boolean(chars[i]?.trim());
        return (
          <motion.input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={chars[i]?.trim() || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1}`}
            animate={filled ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={springSnappy}
            className={`h-14 w-11 rounded-2xl border-2 bg-white text-center font-display text-2xl font-semibold text-ink-900 transition-colors focus:outline-none sm:h-16 sm:w-14 ${
              filled
                ? "border-clay-500 shadow-[0_0_0_4px_rgba(227,91,40,.1)]"
                : "border-ink-200 focus:border-clay-400"
            }`}
          />
        );
      })}
    </div>
  );
}
