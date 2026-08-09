// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { EASE, viewportOnce } from "./ui/motion";
import Marquee from "./ui/Marquee";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Sofas", to: "/products?category=sofas" },
      { label: "Beds", to: "/products?category=bed" },
      { label: "Dining sets", to: "/products?category=dining%20sets" },
      { label: "Chairs", to: "/products?category=chairs" },
      { label: "All products", to: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Company profile", to: "/company_profile" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Store policies", to: "/policies" },
      { label: "Terms & conditions", to: "/terms" },
      { label: "Privacy policy", to: "/privacy" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/Mushmat", label: "GitHub" },
];

const MARQUEE_WORDS = [
  "Handcrafted",
  "Made to order",
  "1-year warranty",
  "Free delivery",
  "Solid wood",
  "Since 2019",
];

export default function Footer() {
  return (
    <footer className="relative isolate mt-24 overflow-hidden bg-ink-950 text-ink-300">
      {/* ambient light */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="blob -left-32 -top-32 h-[30rem] w-[30rem] animate-drift bg-clay-700/25" />
        <div
          className="blob -right-24 bottom-0 h-[26rem] w-[26rem] animate-drift bg-jade-700/20"
          style={{ animationDelay: "-11s" }}
        />
      </div>
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      {/* scrolling value props */}
      <div className="border-b border-white/[.07] py-6">
        <Marquee speed={44} itemClassName="flex items-center">
          {MARQUEE_WORDS.map((w) => (
            <span
              key={w}
              className="flex items-center gap-8 whitespace-nowrap px-8 font-display text-2xl font-medium text-ink-600 sm:text-3xl"
            >
              {w}
              <span className="h-1.5 w-1.5 rounded-full bg-clay-500" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link to="/" className="mb-5 inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-50 text-ink-950">
                <span className="font-display text-xl font-bold leading-none">F</span>
              </span>
              <span className="font-display text-2xl font-semibold text-sand-50">
                Furnicasa
              </span>
            </Link>

            <p className="mb-7 max-w-sm text-sm leading-relaxed text-ink-400">
              Furniture built for how you actually live — curated for style,
              made for durability, priced without the showroom mark-up.
            </p>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:cc.furnicasa@gmail.com"
                  className="group flex items-center gap-3 text-ink-300 transition-colors hover:text-sand-50"
                >
                  <Mail size={16} className="text-clay-400" />
                  cc.furnicasa@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918058265231"
                  className="group flex items-center gap-3 text-ink-300 transition-colors hover:text-sand-50"
                >
                  <Phone size={16} className="text-clay-400" />
                  +91 80582 65231
                </a>
              </li>
              <li className="flex items-start gap-3 text-ink-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-clay-400" />
                C-193, Riico Residential Colony, Sitapura,
                <br />
                Jaipur, Rajasthan 302022
              </li>
            </ul>

            <div className="mt-7 flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.04] text-ink-300 transition-colors hover:border-clay-500/50 hover:bg-clay-600 hover:text-white"
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* link columns */}
          {COLUMNS.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 * (ci + 1) }}
            >
              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-sand-50">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-sand-50"
                    >
                      <span className="link-underline">{l.label}</span>
                      <ArrowUpRight
                        size={13}
                        className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[.07] pt-8 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Furnicasa. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade-400" />
            Designed &amp; built in Jaipur, India
          </p>
        </div>
      </div>
    </footer>
  );
}
