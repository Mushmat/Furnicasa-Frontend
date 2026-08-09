// src/components/LoadingOverlay.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLoading } from "../context/LoadingContext";
import { EASE } from "./ui/motion";

/**
 * Full-screen loader shown while any axios request is in flight. Three cubes
 * orbit a shared centre in 3D so the wait reads as intentional rather than as
 * a stalled page.
 */
export default function LoadingOverlay() {
  const { loading } = useLoading();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950/45 backdrop-blur-md"
        >
          <div className="perspective-1000">
            <motion.div
              className="preserve-3d relative h-16 w-16"
              animate={{ rotateX: 360, rotateY: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            >
              {[
                { t: "translateZ(28px)", c: "bg-clay-500/90" },
                { t: "rotateY(90deg) translateZ(28px)", c: "bg-clay-400/80" },
                { t: "rotateX(90deg) translateZ(28px)", c: "bg-sand-100/85" },
              ].map((face, i) => (
                <span
                  key={i}
                  className={`absolute inset-0 rounded-lg ${face.c}`}
                  style={{ transform: face.t }}
                />
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 font-display text-sm tracking-[.28em] text-sand-100"
          >
            FURNICASA
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
