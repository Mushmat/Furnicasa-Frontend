// src/pages/AdminProductList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Boxes } from "lucide-react";

import { useToast } from "../components/ui/Toast";
import AdminShell from "../components/ui/AdminShell";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState, ProductImage, inr } from "../components/ui/Bits";
import { EASE } from "../components/ui/motion";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const nav = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Could not load the catalogue.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const list = useMemo(() => {
    const query = q.toLowerCase();
    return products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.title.toLowerCase().includes(query)
    );
  }, [products, q, cat]);

  const remove = async (id, title) => {
    if (!confirm(`Delete “${title}”? This can't be undone.`)) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((p) => p.filter((x) => x._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete that product.");
    }
  };

  return (
    <AdminShell
      title="Products"
      subtitle={`${products.length} item${products.length === 1 ? "" : "s"} in the catalogue`}
      action={
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={16} />
          New product
        </Link>
      }
    >
      {/* toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative min-w-[16rem] flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="input pl-11"
          />
        </div>

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label="Filter by category"
          className="select w-52"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title={products.length === 0 ? "No products yet" : "Nothing matches that search"}
          description={
            products.length === 0
              ? "Add your first product and it'll show up in the storefront right away."
              : "Try a different term or category."
          }
          action={
            products.length === 0 && (
              <Link to="/admin/products/new" className="btn-primary">
                <Plus size={16} />
                Add a product
              </Link>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
          {/* header row — desktop only */}
          <div className="hidden grid-cols-[4.5rem_1fr_9rem_9rem_7rem] gap-4 border-b border-ink-100 bg-sand-100/70 px-5 py-3 text-[11px] font-bold uppercase tracking-[.14em] text-ink-400 lg:grid">
            <span>Image</span>
            <span>Title</span>
            <span>Price</span>
            <span>Category</span>
            <span className="text-right">Actions</span>
          </div>

          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: EASE, delay: Math.min(i, 10) * 0.02 }}
                className="flex flex-wrap items-center gap-4 border-b border-ink-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-sand-100/50 lg:grid lg:grid-cols-[4.5rem_1fr_9rem_9rem_7rem]"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                  <ProductImage
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2-safe font-medium text-ink-900">
                    {p.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {p.discountPercent > 0 && (
                      <span className="badge bg-clay-100 text-clay-700">
                        −{p.discountPercent}%
                      </span>
                    )}
                    {p.outOfStock && (
                      <span className="badge bg-ink-900 text-sand-50">
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-display font-semibold text-ink-900">
                  {inr(p.price)}
                </p>

                <p className="text-sm capitalize text-ink-500">
                  {p.category || "—"}
                </p>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => nav(`/admin/products/${p._id}/edit`)}
                    aria-label={`Edit ${p.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/[.06] text-ink-600 transition-colors hover:bg-ink-900 hover:text-sand-50"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(p._id, p.title)}
                    aria-label={`Delete ${p.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/[.06] text-ink-600 transition-colors hover:bg-clay-600 hover:text-white"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}
