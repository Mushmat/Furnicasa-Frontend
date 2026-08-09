// src/pages/FAQs.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, MessageCircleQuestion, ArrowRight } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import { Section } from "../components/ui/Section";
import { EmptyState } from "../components/ui/Bits";
import { EASE, spring } from "../components/ui/motion";

const CATEGORIES = ["All", "Delivery", "Warranty", "Orders"];

const FAQS = [
  {
    cat: "Delivery",
    q: "How long will my order take to arrive?",
    a: (
      <p>
        <strong>Ready items</strong> such as scatter pillows or in-stock lighting
        reach you within <em>7 – 15 days</em>. Custom-built pieces (sofas, large
        furniture, bespoke lighting) require <em>4 – 6 weeks</em> from order
        confirmation.
      </p>
    ),
  },
  {
    cat: "Delivery",
    q: "Do you charge for delivery?",
    a: (
      <p>
        Standard curb-side delivery is <strong>free across India</strong>. If
        your building requires additional manpower — for floors above ground
        without a service lift — you can either arrange helpers yourself or ask
        us for a separate quotation.
      </p>
    ),
  },
  {
    cat: "Delivery",
    q: "What if my doorway or lift is too small?",
    a: (
      <p>
        Please double-check measurements before ordering. Entryway fit is the
        customer's responsibility; we cannot refund or replace items that can't
        pass through your doors, stairwells or lifts.
      </p>
    ),
  },
  {
    cat: "Delivery",
    q: "Can you store my order until my new home is ready?",
    a: (
      <p>
        Yes — we'll hold orders in our warehouse{" "}
        <strong>free for 14 days</strong> after the scheduled dispatch date.
        Beyond that, holding fees apply at{" "}
        <strong>5% of the order value per month + 18% GST</strong>.
      </p>
    ),
  },
  {
    cat: "Delivery",
    q: "Can I track my shipment?",
    a: (
      <p>
        Absolutely. Once your order leaves our warehouse you'll receive an SMS
        with the tracking link and the courier's contact details. You can also
        follow it under <strong>Dashboard → Orders</strong>.
      </p>
    ),
  },
  {
    cat: "Warranty",
    q: "What does the one-year warranty cover?",
    a: (
      <ul>
        <li>Manufacturing defects in frames and construction.</li>
        <li>Material imperfections that affect normal residential use.</li>
        <li>We repair or replace the affected part at our discretion.</li>
      </ul>
    ),
  },
  {
    cat: "Warranty",
    q: "What is not covered by the warranty?",
    a: (
      <ul>
        <li>Natural wear-and-tear, fading, or cushion softening.</li>
        <li>Damage from misuse, accidents, improper assembly or storage.</li>
        <li>Labour and installation costs, and commercial-use damage.</li>
        <li>
          Fabric and leather themselves, except for transit damage reported
          within two days.
        </li>
      </ul>
    ),
  },
  {
    cat: "Warranty",
    q: "How do I raise a warranty claim?",
    a: (
      <p>
        Email <a href="mailto:cc.furnicasa@gmail.com">cc.furnicasa@gmail.com</a>{" "}
        with your order ID, photos of the issue and a brief description. Claims
        for visible defects must be lodged within <strong>7 days</strong> of
        delivery.
      </p>
    ),
  },
  {
    cat: "Orders",
    q: "Do you accept returns?",
    a: (
      <p>
        Because each piece is custom-built to order, we can't accept
        change-of-mind returns. If your item arrives damaged or defective,
        contact us within 48 hours and we'll arrange a repair or replacement
        under warranty.
      </p>
    ),
  },
  {
    cat: "Orders",
    q: "How can I leave a product review?",
    a: (
      <p>
        Log in, open the product page and scroll to{" "}
        <strong>“What buyers think”</strong>. Choose a star rating and add your
        comments. Reviews help other shoppers and can only be submitted by
        verified purchasers.
      </p>
    ),
  },
];

export default function FAQs() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [openIdx, setOpenIdx] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(
      (f) =>
        (cat === "All" || f.cat === cat) &&
        (!q || f.q.toLowerCase().includes(q))
    );
  }, [query, cat]);

  return (
    <div>
      <PageHeader
        kicker="Help centre"
        title="Frequently asked questions"
        subtitle="Delivery windows, warranty cover and everything in between."
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQs" }]}
      />

      <Section size="lg">
        <div className="container-tight">
          {/* search + filters */}
          <div className="mb-10 space-y-5">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenIdx(0);
                }}
                placeholder="Search the questions…"
                aria-label="Search FAQs"
                className="input-lg pl-14"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCat(c);
                    setOpenIdx(0);
                  }}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    cat === c ? "text-sand-50" : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {cat === c && (
                    <motion.span
                      layoutId="faq-cat"
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-ink-900 shadow-lift"
                    />
                  )}
                  <span className="relative z-10">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* list */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={MessageCircleQuestion}
              title="No matching questions"
              description="Try a different phrase, or just ask us directly — we answer fast."
              action={
                <Link to="/contact" className="btn-primary">
                  Contact us
                </Link>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
              {filtered.map((f, i) => {
                const open = openIdx === i;
                return (
                  <div
                    key={f.q}
                    className="border-b border-ink-100 last:border-b-0"
                  >
                    <button
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-5 px-6 py-5 text-left transition-colors hover:bg-sand-100/60 sm:px-8"
                    >
                      <span className="flex-1 font-display text-[17px] font-semibold text-ink-900">
                        {f.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={spring}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                          open ? "bg-clay-600 text-white" : "bg-sand-200 text-ink-600"
                        }`}
                      >
                        <Plus size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="doc px-6 pb-6 sm:px-8">{f.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* still stuck */}
          <div className="mt-10 flex flex-col items-center gap-5 rounded-3xl bg-ink-950 px-8 py-10 text-center text-sand-50 sm:flex-row sm:text-left">
            <MessageCircleQuestion size={30} className="shrink-0 text-clay-400" />
            <div className="flex-1">
              <h3 className="mb-1 font-display text-xl font-semibold text-sand-50">
                Still stuck?
              </h3>
              <p className="text-sm text-ink-300">
                Send us a message and we'll get back within a working day.
              </p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0">
              Contact us
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
