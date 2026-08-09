// src/components/ui/Chrome.jsx
// Small persistent pieces of app chrome: reading progress, back-to-top and the
// ambient colour wash that sits behind every page.
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { spring } from "./motion";

/** Thin gradient bar pinned under the navbar showing page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-clay-grad"
    />
  );
}

/** Appears after a screenful of scrolling. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={spring}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-sand-50 shadow-float transition-colors hover:bg-clay-600"
        >
          <ArrowUp size={19} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Fixed, very soft colour blobs so flat sections never feel like dead paper. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-sand-50" />
      <div className="blob -left-40 top-[-10%] h-[38rem] w-[38rem] animate-drift bg-clay-200/40" />
      <div
        className="blob -right-40 top-[35%] h-[34rem] w-[34rem] animate-drift bg-jade-200/35"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="blob bottom-[-15%] left-1/4 h-[30rem] w-[30rem] animate-drift bg-sand-300/40"
        style={{ animationDelay: "-17s" }}
      />
    </div>
  );
}

/** Jump to the top on every route change — react-router keeps scroll otherwise. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // jump, don't smooth-scroll: html has scroll-smooth and animating the whole
    // page on every navigation reads as lag
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
