// src/pages/Contact.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  Check,
  ArrowRight,
} from "lucide-react";

import { useToast } from "../components/ui/Toast";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";
import { Section } from "../components/ui/Section";
import { EASE, spring } from "../components/ui/motion";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "cc.furnicasa@gmail.com",
    href: "mailto:cc.furnicasa@gmail.com",
    note: "We reply within a working day",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 80582 65231",
    href: "tel:+918058265231",
    note: "Mon–Sat, 10am – 7pm IST",
  },
  {
    icon: MapPin,
    label: "Workshop",
    value: "C-193, Riico Residential Colony, Sitapura, Jaipur, Rajasthan 302022",
    note: "Visits by appointment",
  },
];

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network response was not ok");

      setSent(true);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent — we'll be in touch shortly.");
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error("Sorry, that didn't send. Please try again or email us.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        kicker="Get in touch"
        title="Let's talk about your space"
        subtitle="Questions about an order, a custom build or a delivery date — we're a message away."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <Section size="lg">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          {/* ── channels ── */}
          <div className="space-y-4">
            {CHANNELS.map((c, i) => {
              const inner = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-sand-50 transition-colors duration-300 group-hover:bg-clay-600">
                    <c.icon size={20} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.16em] text-ink-400">
                      {c.label}
                    </p>
                    <p className="font-medium leading-snug text-ink-900">
                      {c.value}
                    </p>
                    <p className="mt-1 text-xs text-ink-400">{c.note}</p>
                  </div>
                </>
              );

              return (
                <Reveal key={c.label} delay={i * 0.08}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="group flex items-start gap-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="group flex items-start gap-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
                      {inner}
                    </div>
                  )}
                </Reveal>
              );
            })}

            <Reveal delay={0.25}>
              <div className="relative isolate overflow-hidden rounded-3xl bg-ink-grad p-7 text-sand-50 shadow-lift">
                <div aria-hidden className="absolute inset-0 -z-10">
                  <div className="blob -right-10 -top-10 h-48 w-48 animate-drift bg-clay-600/40" />
                </div>
                <Clock size={20} className="mb-4 text-clay-400" />
                <h3 className="mb-2 font-display text-lg font-semibold">
                  Looking for delivery timelines?
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-ink-300">
                  Ready items ship in 7–15 days; made-to-order pieces take 4–6
                  weeks. Full detail lives in our policies.
                </p>
                <Link
                  to="/policies"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sand-50"
                >
                  <span className="link-underline">Read store policies</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* ── form ── */}
          <Reveal direction="left" delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-100 bg-white p-8 shadow-card sm:p-10">
              <h2 className="mb-2 font-display text-2xl font-semibold">
                Send us a message
              </h2>
              <p className="mb-8 text-sm text-ink-500">
                Tell us what you're after and we'll come back with options.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    placeholder="Room, dimensions, timeline — whatever helps us help you."
                    className="input resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending || sent}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold transition-all duration-300 ${
                    sent
                      ? "bg-jade-500 text-white"
                      : "bg-clay-grad text-white shadow-[0_10px_30px_-10px_rgba(227,91,40,.7)] hover:-translate-y-0.5"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={sent ? "sent" : sending ? "sending" : "idle"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="flex items-center gap-2"
                    >
                      {sent ? (
                        <>
                          <Check size={17} /> Message sent
                        </>
                      ) : sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send message
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
