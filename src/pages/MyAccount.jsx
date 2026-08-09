// src/pages/MyAccount.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  MapPin,
  UserCog,
  Loader2,
  Heart,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../components/ui/Toast";
import OrderTimeline from "../components/OrderTimeline";
import PageHeader from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState, ProductImage, StatusPill, inr } from "../components/ui/Bits";
import { EASE, spring } from "../components/ui/motion";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Package },
  { key: "address", label: "Address", icon: MapPin },
  { key: "account", label: "Account details", icon: UserCog },
];

const ADDRESS_FIELDS = [
  { key: "street", label: "Street address", span: 2 },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "postalCode", label: "PIN code" },
  { key: "country", label: "Country" },
];

export default function MyAccount() {
  const { user: authUser } = useAuth();
  const { cartItems } = useCart();
  const { items: wishes } = useWishlist();
  const { hash } = useLocation();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [saving, setSaving] = useState(false);

  /* deep links like /my-account#orders */
  useEffect(() => {
    const h = hash.replace("#", "");
    if (TABS.some((t) => t.key === h)) setTab(h);
  }, [hash]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile((p) => ({ ...p, ...data, address: { ...p.address, ...data.address } }));
      } catch (err) {
        console.error("Could not load profile", err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (tab !== "orders") return;
    setOrdersLoading(true);
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(Array.isArray(data) ? data : []);
        setFetchErr("");
      } catch {
        setFetchErr("Could not load your orders. Please try again later.");
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, [tab, token]);

  const patchProfile = async (payload, successMsg) => {
    setSaving(true);
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((p) => ({ ...p, ...data, address: { ...p.address, ...data.address } }));
      toast.success(successMsg);
    } catch {
      toast.error("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveAccount = (e) => {
    e.preventDefault();
    patchProfile(
      { fullName: profile.fullName, phone: profile.phone },
      "Account details updated"
    );
  };

  const saveAddress = (e) => {
    e.preventDefault();
    patchProfile({ address: profile.address }, "Address updated");
  };

  const displayName = profile.fullName || profile.email || authUser?.email || "there";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <PageHeader
        kicker="Your account"
        title={`Hello, ${profile.fullName?.split(" ")[0] || "there"}`}
        crumbs={[{ label: "Home", to: "/" }, { label: "My account" }]}
        compact
      />

      <div className="container-x py-14">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── sidebar ── */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-32">
              {/* profile card */}
              <div className="mb-4 flex items-center gap-4 rounded-3xl border border-ink-100 bg-white p-5 shadow-soft">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-900 font-display text-lg font-semibold text-sand-50">
                  {initials || "F"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">
                    {profile.fullName || "Furnicasa customer"}
                  </p>
                  <p className="truncate text-xs text-ink-400">{profile.email}</p>
                </div>
              </div>

              <nav className="flex gap-1 overflow-x-auto rounded-3xl border border-ink-100 bg-white p-2 shadow-soft no-scrollbar lg:flex-col lg:overflow-visible">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`relative flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium transition-colors lg:w-full ${
                      tab === key ? "text-sand-50" : "text-ink-600 hover:text-ink-900"
                    }`}
                  >
                    {tab === key && (
                      <motion.span
                        layoutId="account-tab"
                        transition={spring}
                        className="absolute inset-0 rounded-2xl bg-ink-900"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      <Icon size={17} />
                      {label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── content ── */}
          <main className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {/* ═══ dashboard ═══ */}
                {tab === "dashboard" && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
                      <h2 className="mb-3 font-display text-2xl font-semibold">
                        Welcome back
                      </h2>
                      <p className="max-w-xl leading-relaxed text-ink-500">
                        From here you can follow your orders, keep your delivery
                        address current and update your account details.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <StatTile
                        icon={Package}
                        label="Orders"
                        value={orders.length}
                        onClick={() => setTab("orders")}
                      />
                      <StatTile
                        icon={Heart}
                        label="Wishlist"
                        value={wishes.length}
                        to="/wishlist"
                      />
                      <StatTile
                        icon={ShoppingBag}
                        label="In cart"
                        value={cartItems.length}
                        to="/cart"
                      />
                    </div>

                    <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
                      <h3 className="mb-5 font-display text-lg font-semibold">
                        Delivery address
                      </h3>
                      {profile.address?.street ? (
                        <address className="not-italic leading-relaxed text-ink-600">
                          {profile.fullName}
                          <br />
                          {profile.address.street}
                          <br />
                          {profile.address.city}, {profile.address.state}{" "}
                          {profile.address.postalCode}
                          <br />
                          {profile.address.country}
                        </address>
                      ) : (
                        <p className="text-ink-400">
                          You haven't saved an address yet.
                        </p>
                      )}
                      <button
                        onClick={() => setTab("address")}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clay-600 hover:underline"
                      >
                        {profile.address?.street ? "Edit address" : "Add address"}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══ orders ═══ */}
                {tab === "orders" && (
                  <div className="space-y-6">
                    <h2 className="font-display text-2xl font-semibold">
                      My orders
                    </h2>

                    {ordersLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-56 rounded-3xl" />
                        ))}
                      </div>
                    ) : fetchErr ? (
                      <div className="rounded-3xl border border-clay-200 bg-clay-50 p-6 text-clay-700">
                        {fetchErr}
                      </div>
                    ) : orders.length === 0 ? (
                      <EmptyState
                        icon={Package}
                        title="No orders yet"
                        description="Once you place an order it'll appear here with live tracking."
                        action={
                          <Link to="/products" className="btn-primary">
                            Start shopping
                          </Link>
                        }
                      />
                    ) : (
                      orders.map((order, i) => (
                        <motion.article
                          key={order._id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                          className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 bg-sand-100/60 p-6">
                            <div>
                              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                                Order
                              </p>
                              <p className="font-mono text-sm font-semibold text-ink-900">
                                {order._id.slice(-10)}
                              </p>
                              <p className="mt-1 text-xs text-ink-400">
                                Placed{" "}
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>

                            <div className="text-right">
                              <StatusPill status={order.status} />
                              <p className="mt-2 font-display text-xl font-semibold text-ink-900">
                                {inr(order.totalPrice)}
                              </p>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {order.items.map((it) => (
                                <Link
                                  key={it._id}
                                  to={`/product/${it.product?._id || ""}`}
                                  className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-sand-100"
                                >
                                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                                    <ProductImage
                                      src={it.product?.imageUrl}
                                      alt={it.product?.title || "Product"}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="line-clamp-2-safe text-sm font-medium text-ink-900">
                                      {it.product?.title || "Item removed"}
                                    </p>
                                    <p className="text-xs text-ink-400">
                                      Qty {it.quantity} ·{" "}
                                      {inr(it.price * it.quantity)}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            <OrderTimeline
                              status={order.status}
                              placedDate={order.createdAt}
                            />
                          </div>
                        </motion.article>
                      ))
                    )}
                  </div>
                )}

                {/* ═══ address ═══ */}
                {tab === "address" && (
                  <form
                    onSubmit={saveAddress}
                    className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft"
                  >
                    <h2 className="mb-2 font-display text-2xl font-semibold">
                      Delivery address
                    </h2>
                    <p className="mb-7 text-sm text-ink-500">
                      We'll use this as the default for new orders.
                    </p>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {ADDRESS_FIELDS.map((f) => (
                        <div
                          key={f.key}
                          className={f.span === 2 ? "sm:col-span-2" : ""}
                        >
                          <label htmlFor={f.key} className="label">
                            {f.label}
                          </label>
                          <input
                            id={f.key}
                            name={f.key}
                            value={profile.address?.[f.key] || ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setProfile((p) => ({
                                ...p,
                                address: { ...p.address, [f.key]: v },
                              }));
                            }}
                            className="input"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary mt-8"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Saving…
                        </>
                      ) : (
                        "Save address"
                      )}
                    </button>
                  </form>
                )}

                {/* ═══ account ═══ */}
                {tab === "account" && (
                  <form
                    onSubmit={saveAccount}
                    className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft"
                  >
                    <h2 className="mb-2 font-display text-2xl font-semibold">
                      Account details
                    </h2>
                    <p className="mb-7 text-sm text-ink-500">
                      Your email is the login for this account and can't be
                      changed here.
                    </p>

                    <div className="space-y-5">
                      <div>
                        <label htmlFor="fullName" className="label">
                          Full name
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          value={profile.fullName || ""}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, fullName: e.target.value }))
                          }
                          className="input"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="label">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          value={profile.email || ""}
                          disabled
                          className="input cursor-not-allowed bg-sand-100 text-ink-400"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="label">
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profile.phone || ""}
                          onChange={(e) =>
                            setProfile((p) => ({ ...p, phone: e.target.value }))
                          }
                          className="input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary mt-8"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Saving…
                        </>
                      ) : (
                        "Save details"
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, to, onClick }) {
  const inner = (
    <>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sand-100 text-clay-600 transition-colors group-hover:bg-clay-600 group-hover:text-white">
        <Icon size={19} />
      </span>
      <p className="font-display text-3xl font-semibold text-ink-900">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">{label}</p>
    </>
  );

  const cls =
    "group flex w-full flex-col items-start rounded-3xl border border-ink-100 bg-white p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-card";

  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
