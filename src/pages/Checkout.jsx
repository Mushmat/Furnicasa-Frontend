// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  Lock,
  AlertTriangle,
  Check,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/Toast";
import PageHeader from "../components/ui/PageHeader";
import { EmptyState, ProductImage, inr } from "../components/ui/Bits";
import { EASE } from "../components/ui/motion";

const FIELDS = [
  { name: "fullName", label: "Full name", span: 2, autoComplete: "name" },
  { name: "phone", label: "Phone number", span: 2, autoComplete: "tel", type: "tel" },
  { name: "address", label: "Address", span: 2, autoComplete: "street-address" },
  { name: "postalCode", label: "PIN code", span: 1, autoComplete: "postal-code", inputMode: "numeric" },
  { name: "city", label: "City", span: 1, autoComplete: "address-level2" },
  { name: "state", label: "State", span: 1, autoComplete: "address-level1" },
  { name: "country", label: "Country", span: 1, autoComplete: "country-name" },
];

const REQUIRED = ["fullName", "phone", "address", "postalCode", "city", "state", "country"];

const STEPS = ["Cart", "Delivery details", "Payment"];

/* look up an Indian PIN code to pre-fill city / state */
const lookupPin = async (pin) => {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const json = await res.json();
    const office = json?.[0]?.PostOffice?.[0];
    if (!office) return null;
    return { city: office.District, state: office.State, country: "India" };
  } catch {
    return null;
  }
};

export default function Checkout() {
  const { cartItems, dispatch } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const discountPercent = location.state?.discountPercent || 0;
  const priceAfterDisc = (p) =>
    Math.round(p.price * (1 - (p.discountPercent || 0) / 100));

  const [ship, setShip] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinFilled, setPinFilled] = useState(false);
  const [paying, setPaying] = useState(false);

  const handleChange = (e) => setShip({ ...ship, [e.target.name]: e.target.value });

  /* auto-fill city / state / country from the PIN code */
  useEffect(() => {
    const pin = ship.postalCode.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPinFilled(false);
      return;
    }

    let cancelled = false;
    setPinLoading(true);

    (async () => {
      const data = await lookupPin(pin);
      if (cancelled) return;
      if (data) {
        setShip((s) => ({
          ...s,
          city: s.city || data.city,
          state: s.state || data.state,
          country: s.country || data.country,
        }));
        setPinFilled(true);
      }
      setPinLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [ship.postalCode]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, i) => sum + priceAfterDisc(i.product) * i.quantity, 0),
    [cartItems]
  );
  const discountAmt = Math.round((subtotal * discountPercent) / 100);
  const totalToPay = subtotal - discountAmt;

  const missing = REQUIRED.filter((f) => !ship[f].trim());
  const canPay = missing.length === 0 && cartItems.length > 0 && !paying;

  /* ── payment ──────────────────────────────────────────── */
  const pay = async () => {
    if (!canPay) return;
    setPaying(true);

    try {
      const { data: rzpOrder } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create`,
        { amount: totalToPay },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const opts = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Furnicasa",
        description: "Furniture Purchase",
        order_id: rzpOrder.id,
        prefill: { name: ship.fullName, contact: ship.phone },
        handler: async (resp) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
              resp,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const items = cartItems.map((i) => ({
              productId: i.product._id,
              quantity: i.quantity,
              price: priceAfterDisc(i.product),
            }));

            const { data: order } = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
              { items, shippingAddress: ship, status: "Paid" },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            dispatch({ type: "SET_CART", payload: [] });
            navigate("/order-confirmation", {
              state: { orderId: order._id, totalPrice: order.totalPrice },
            });
          } catch {
            toast.error("Payment verification failed. Please contact us.");
          }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#E35B28" },
      };

      new window.Razorpay(opts).open();
    } catch {
      toast.error("Could not start the payment. Please try again.");
      setPaying(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div>
        <PageHeader
          kicker="Almost there"
          title="Checkout"
          crumbs={[{ label: "Home", to: "/" }, { label: "Checkout" }]}
          compact
        />
        <EmptyState
          icon={ShoppingBag}
          title="There's nothing to check out"
          description="Add a piece to your cart and come back here to complete the order."
          action={
            <Link to="/products" className="btn-primary btn-lg">
              Browse the catalogue
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        kicker="Almost there"
        title="Checkout"
        crumbs={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]}
        compact
      />

      <div className="container-x py-14">
        {/* stepper */}
        <ol className="mx-auto mb-14 flex max-w-2xl items-center">
          {STEPS.map((s, i) => {
            const done = i < 1;
            const current = i === 1;
            return (
              <li key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-3">
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      done
                        ? "bg-jade-500 text-white"
                        : current
                          ? "bg-ink-900 text-sand-50 shadow-lift"
                          : "bg-ink-100 text-ink-400"
                    }`}
                  >
                    {done ? <Check size={16} /> : i + 1}
                  </motion.span>
                  <span
                    className={`hidden text-sm font-medium sm:block ${
                      current ? "text-ink-900" : "text-ink-400"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className={`mx-4 h-px flex-1 ${done ? "bg-jade-400" : "bg-ink-200"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="grid gap-8 lg:grid-cols-[1fr_23rem]">
          {/* ── form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-6"
          >
            {/* policy notice */}
            <div className="flex gap-4 rounded-3xl border border-gold-400/30 bg-gold-400/[.07] p-5">
              <AlertTriangle size={19} className="mt-0.5 shrink-0 text-gold-600" />
              <div className="space-y-1.5 text-sm leading-relaxed">
                <p className="text-ink-700">
                  Please read our{" "}
                  <Link to="/policies" className="link-underline font-semibold text-ink-900">
                    store policies
                  </Link>
                  ,{" "}
                  <Link to="/terms" className="link-underline font-semibold text-ink-900">
                    terms &amp; conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="link-underline font-semibold text-ink-900">
                    privacy policy
                  </Link>{" "}
                  before placing an order.
                </p>
                <p className="font-semibold text-clay-700">
                  All sales are final — no refunds once an order is confirmed.
                </p>
              </div>
            </div>

            {/* shipping */}
            <div className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
              <h2 className="mb-6 font-display text-xl font-semibold">
                Delivery details
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div
                    key={f.name}
                    className={f.span === 2 ? "sm:col-span-2" : ""}
                  >
                    <label htmlFor={f.name} className="label">
                      {f.label}
                    </label>
                    <div className="relative">
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.type || "text"}
                        inputMode={f.inputMode}
                        autoComplete={f.autoComplete}
                        value={ship[f.name]}
                        onChange={handleChange}
                        className="input"
                      />
                      {f.name === "postalCode" && pinLoading && (
                        <Loader2
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-clay-500"
                        />
                      )}
                      {f.name === "postalCode" && !pinLoading && pinFilled && (
                        <Check
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-jade-500"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pinFilled && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xs text-jade-700"
                >
                  City and state filled in from your PIN code — edit them if
                  anything looks off.
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* ── summary ── */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card"
            >
              <div className="p-6">
                <h2 className="mb-5 font-display text-lg font-semibold">
                  Order summary
                </h2>

                <ul className="mb-5 max-h-72 space-y-4 overflow-y-auto pr-1">
                  {cartItems.map((i) => (
                    <li key={i.product._id} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                        <ProductImage
                          src={i.product.imageUrl}
                          alt={i.product.title}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
                          {i.quantity}
                        </span>
                      </div>
                      <p className="line-clamp-2-safe min-w-0 flex-1 text-sm text-ink-700">
                        {i.product.title}
                      </p>
                      <span className="shrink-0 text-sm font-semibold text-ink-900">
                        {inr(priceAfterDisc(i.product) * i.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="hairline mb-5" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Subtotal</span>
                    <span className="font-semibold">{inr(subtotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-jade-700">
                      <span>Coupon ({discountPercent}%)</span>
                      <span className="font-semibold">− {inr(discountAmt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-ink-500">Delivery</span>
                    <span className="font-semibold text-jade-700">
                      {totalToPay >= 10000 ? "Free" : "Calculated on dispatch"}
                    </span>
                  </div>
                </div>

                <div className="hairline my-5" />

                <div className="flex items-baseline justify-between">
                  <span className="font-display text-lg font-semibold">
                    Total to pay
                  </span>
                  <span className="font-display text-2xl font-semibold">
                    {inr(totalToPay)}
                  </span>
                </div>
              </div>

              <button
                onClick={pay}
                disabled={!canPay}
                className={`flex w-full items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
                  canPay
                    ? "bg-clay-grad text-white hover:brightness-110"
                    : "cursor-not-allowed bg-ink-100 text-ink-400"
                }`}
              >
                {paying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Opening payment…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Pay {inr(totalToPay)}
                  </>
                )}
              </button>
            </motion.div>

            {missing.length > 0 && (
              <p className="mt-3 text-center text-xs text-ink-400">
                Fill in all delivery details to continue
              </p>
            )}

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-400">
              <ShieldCheck size={14} />
              Secured by Razorpay · Cards, UPI &amp; net-banking
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
