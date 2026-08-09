// src/components/Button.jsx
import React from "react";
import { motion } from "framer-motion";
import { spring } from "./ui/motion";

const VARIANTS = {
  primary: "btn-primary btn-sheen",
  ink: "btn-ink",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

const SIZES = { sm: "btn-sm", md: "", lg: "btn-lg" };

export default function Button({
  text,
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={spring}
      className={`${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${
        full ? "w-full" : ""
      } ${className}`}
      {...rest}
    >
      {children ?? text}
    </motion.button>
  );
}
