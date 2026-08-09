// src/components/ui/motion.js
// Shared motion vocabulary. Every page pulls its timing from here so the whole
// site moves with one personality instead of a dozen ad-hoc transitions.

export const EASE = [0.16, 1, 0.3, 1]; // out-expo
export const EASE_BACK = [0.34, 1.56, 0.64, 1]; // gentle overshoot

export const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 };
export const springSoft = { type: "spring", stiffness: 140, damping: 20 };
export const springSnappy = { type: "spring", stiffness: 420, damping: 30 };

/* ── entrance variants ─────────────────────────────────────── */

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/* rises out of the page with a touch of depth */
export const rise3d = {
  hidden: { opacity: 0, y: 40, rotateX: -8, transformPerspective: 1200 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export const slideLeft = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const slideRight = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ── containers ────────────────────────────────────────────── */

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/* ── route transition ──────────────────────────────────────── */

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
};

/* ── shared interaction states ─────────────────────────────── */

export const hoverLift = {
  whileHover: { y: -4, transition: springSnappy },
  whileTap: { scale: 0.97 },
};

export const tapOnly = { whileTap: { scale: 0.96 } };

/* viewport config used by every scroll-reveal on the site */
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" };
