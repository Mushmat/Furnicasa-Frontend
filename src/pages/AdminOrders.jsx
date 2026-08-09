// src/pages/AdminOrders.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, MapPin, Package, Search } from "lucide-react";

import { useToast } from "../components/ui/Toast";
import AdminShell from "../components/ui/AdminShell";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState, ProductImage, StatusPill, inr } from "../components/ui/Bits";
import { EASE } from "../components/ui/motion";

const STATUS_OPTIONS = [
  "Pending",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const toast = useToast();
  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (_id, status) => {
    /* optimistic — the select should feel instant */
    setOrders((o) => o.map((x) => (x._id === _id ? { ...x, status } : x)));
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${_id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Marked as ${status}`);
      fetchOrders();
    } catch (err) {
      console.error("Could not update order:", err);
      toast.error("Status update failed.");
      fetchOrders();
    }
  };

  const deleteOrder = async (_id) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((o) => o.filter((x) => x._id !== _id));
      toast.success("Order deleted");
    } catch (err) {
      console.error("Could not delete order:", err);
      toast.error("Failed to delete the order.");
    }
  };

  const counts = useMemo(() => {
    const c = { All: orders.length };
    STATUS_OPTIONS.forEach((s) => {
      c[s] = orders.filter((o) => o.status === s).length;
    });
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "All" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o._id.toLowerCase().includes(q) ||
        (o.shippingAddress?.fullName || "").toLowerCase().includes(q) ||
        (o.shippingAddress?.phone || "").includes(q)
      );
    });
  }, [orders, filter, query]);

  return (
    <AdminShell
      title="Orders"
      subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} in total`}
    >
      {/* toolbar */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID, name or phone…"
            aria-label="Search orders"
            className="input pl-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === s
                  ? "bg-ink-900 text-sand-50"
                  : "bg-ink-900/[.05] text-ink-600 hover:bg-ink-900/10"
              }`}
            >
              {s}
              <span className="ml-1.5 opacity-60">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-3xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Package}
          title={orders.length === 0 ? "No orders yet" : "Nothing matches that filter"}
          description={
            orders.length === 0
              ? "Orders will appear here as soon as customers check out."
              : "Try a different status or clear the search."
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visible.map((order, i) => {
              const sa = order.shippingAddress || {};
              return (
                <motion.article
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 6) * 0.04 }}
                  className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft"
                >
                  {/* header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 bg-sand-100/60 p-6">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                        Order
                      </p>
                      <p className="font-mono text-sm font-semibold text-ink-900">
                        {order._id.slice(-10)}
                      </p>
                      <p className="mt-2 font-display text-xl font-semibold text-ink-900">
                        {inr(order.totalPrice)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill status={order.status} />

                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        aria-label="Update order status"
                        className="select w-44 py-2 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => deleteOrder(order._id)}
                        aria-label="Delete order"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-clay-50 hover:text-clay-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 p-6 lg:grid-cols-[18rem_1fr]">
                    {/* ship-to */}
                    {sa.fullName ? (
                      <div className="rounded-2xl bg-sand-100/70 p-5">
                        <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                          <MapPin size={13} />
                          Ship to
                        </p>
                        <address className="not-italic text-sm leading-relaxed text-ink-700">
                          <span className="font-semibold text-ink-900">
                            {sa.fullName}
                          </span>
                          {sa.phone && (
                            <>
                              <br />
                              {sa.phone}
                            </>
                          )}
                          <br />
                          {sa.address}
                          <br />
                          {sa.city}, {sa.state} {sa.postalCode}
                          <br />
                          {sa.country}
                        </address>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-sand-100/70 p-5 text-sm text-ink-400">
                        No shipping address on this order.
                      </div>
                    )}

                    {/* items */}
                    <div className="divide-y divide-ink-100">
                      {order.items.map(({ product, quantity }) => (
                        <div
                          key={product?._id || Math.random()}
                          className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                            <ProductImage
                              src={product?.imageUrl}
                              alt={product?.title || "Product"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2-safe text-sm font-medium text-ink-900">
                              {product?.title || "Item removed"}
                            </p>
                            <p className="text-xs text-ink-400">Qty {quantity}</p>
                          </div>
                          <p className="shrink-0 text-sm font-semibold text-ink-900">
                            {inr((product?.price || 0) * quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </AdminShell>
  );
}
