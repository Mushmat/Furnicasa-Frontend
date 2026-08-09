// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Boxes,
  IndianRupee,
  MessagesSquare,
  ArrowRight,
  Plus,
} from "lucide-react";

import AdminShell from "../components/ui/AdminShell";
import Counter from "../components/ui/Counter";
import { Skeleton } from "../components/ui/Skeleton";
import { EASE } from "../components/ui/motion";

const QUICK_LINKS = [
  {
    to: "/admin/orders",
    icon: ShoppingCart,
    title: "Manage orders",
    desc: "Update statuses, review shipping details and remove test orders.",
  },
  {
    to: "/admin/products",
    icon: Boxes,
    title: "Add or edit products",
    desc: "Manage the catalogue, pricing, discounts and stock flags.",
  },
  {
    to: "/admin/contacts",
    icon: MessagesSquare,
    title: "Contact messages",
    desc: "Read everything that comes in through the contact form.",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, sales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/overview`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const TILES = [
    { icon: ShoppingCart, label: "Orders", value: stats.orders, tone: "clay" },
    { icon: Boxes, label: "Products", value: stats.products, tone: "jade" },
    { icon: IndianRupee, label: "Sales", value: stats.sales, tone: "ink", money: true },
  ];

  return (
    <AdminShell
      title="Overview"
      subtitle="Everything happening across the store, at a glance."
      action={
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={16} />
          New product
        </Link>
      }
    >
      {/* KPI tiles */}
      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {TILES.map((t, i) => {
          const tones = {
            clay: "from-clay-500 to-clay-700",
            jade: "from-jade-500 to-jade-700",
            ink: "from-ink-700 to-ink-950",
          };

          return (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              className={`relative isolate overflow-hidden rounded-3xl bg-gradient-to-br ${tones[t.tone]} p-7 text-white shadow-lift`}
            >
              <div aria-hidden className="grain absolute inset-0 -z-10" />
              <span
                aria-hidden
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
              />

              <t.icon size={22} className="mb-6 opacity-80" />

              {loading ? (
                <Skeleton className="h-10 w-28 bg-white/20" />
              ) : (
                <p className="font-display text-4xl font-semibold leading-none">
                  {t.money && "₹"}
                  <Counter value={Number(t.value) || 0} />
                </p>
              )}

              <p className="mt-3 text-xs uppercase tracking-[.18em] opacity-70">
                {t.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* quick links */}
      <div className="grid gap-5 md:grid-cols-3">
        {QUICK_LINKS.map((l, i) => (
          <motion.div
            key={l.to}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.25 + i * 0.08 }}
          >
            <Link
              to={l.to}
              className="group flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-sand-100 text-ink-700 transition-colors group-hover:bg-ink-900 group-hover:text-sand-50">
                <l.icon size={19} />
              </span>

              <h3 className="mb-2 font-display text-lg font-semibold">
                {l.title}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-ink-500">
                {l.desc}
              </p>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-clay-600">
                Open
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </AdminShell>
  );
}
