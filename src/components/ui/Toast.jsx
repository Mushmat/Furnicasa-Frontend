// src/components/ui/Toast.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertTriangle, Info, X, ShoppingBag } from "lucide-react";
import { spring } from "./motion";

const ToastCtx = createContext(null);

/** useToast().success("Added to cart") — replaces the site's window.alert calls. */
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const ICONS = {
  success: Check,
  error: AlertTriangle,
  info: Info,
  cart: ShoppingBag,
};

const STYLES = {
  success: "border-jade-200 bg-jade-50 text-jade-800",
  error: "border-clay-200 bg-clay-50 text-clay-800",
  info: "border-ink-200 bg-white text-ink-800",
  cart: "border-ink-800 bg-ink-900 text-sand-50",
};

const ICON_STYLES = {
  success: "bg-jade-500 text-white",
  error: "bg-clay-600 text-white",
  info: "bg-ink-800 text-white",
  cart: "bg-clay-500 text-white",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, { variant = "info", title, duration = 4000 } = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t.slice(-3), { id, message, variant, title }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration)
      );
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      push,
      dismiss,
      success: (m, o) => push(m, { ...o, variant: "success" }),
      error: (m, o) => push(m, { ...o, variant: "error" }),
      info: (m, o) => push(m, { ...o, variant: "info" }),
      cart: (m, o) => push(m, { ...o, variant: "cart" }),
    }),
    [push, dismiss]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end sm:p-0"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const Icon = ICONS[t.variant] || Info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
                transition={spring}
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-float backdrop-blur-xl ${
                  STYLES[t.variant]
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    ICON_STYLES[t.variant]
                  }`}
                >
                  <Icon size={15} strokeWidth={2.6} />
                </span>

                <div className="min-w-0 flex-1">
                  {t.title && (
                    <p className="text-sm font-semibold leading-tight">{t.title}</p>
                  )}
                  <p className="text-sm leading-snug opacity-90">{t.message}</p>
                </div>

                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="-mr-1 rounded-lg p-1 opacity-50 transition hover:opacity-100"
                >
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
