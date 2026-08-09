// src/components/ui/AdminShell.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  MessagesSquare,
  ArrowUpRight,
} from "lucide-react";
import { EASE, spring } from "./motion";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/contacts", label: "Messages", icon: MessagesSquare },
];

/**
 * Consistent frame for the admin area: a dark rail of section links plus a
 * page title row. The storefront pages get the marketing treatment; this side
 * stays quiet and dense so it's fast to work in.
 */
export default function AdminShell({ title, subtitle, action, children }) {
  const { pathname } = useLocation();

  const isActive = (item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="container-x py-10">
      {/* nav rail */}
      <nav className="mb-8 flex gap-1 overflow-x-auto rounded-2xl bg-ink-950 p-1.5 no-scrollbar">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? "text-ink-950" : "text-ink-400 hover:text-sand-50"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav"
                  transition={spring}
                  className="absolute inset-0 rounded-xl bg-sand-50"
                />
              )}
              {/* sits above the pill — a negative z-index would drop it behind
                  the rail's own background */}
              <span className="relative z-10 flex items-center gap-2">
                <item.icon size={16} />
                {item.label}
              </span>
            </Link>
          );
        })}

        <Link
          to="/"
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-400 transition-colors hover:text-sand-50"
        >
          View store
          <ArrowUpRight size={14} />
        </Link>
      </nav>

      {/* title row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-ink-500">{subtitle}</p>}
        </div>
        {action}
      </motion.div>

      {children}
    </div>
  );
}
