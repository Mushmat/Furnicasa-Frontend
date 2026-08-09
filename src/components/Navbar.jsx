// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  ArrowRight,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { EASE, spring, springSnappy } from "./ui/motion";

const categories = [
  { key: "sofas", blurb: "Lounge in comfort" },
  { key: "bed", blurb: "Rest, redesigned" },
  { key: "dining sets", blurb: "Gather around" },
  { key: "chairs", blurb: "Seats with character" },
  { key: "center tables", blurb: "The centrepiece" },
  { key: "trophies", blurb: "Mark the moment" },
  { key: "accessories", blurb: "Finishing touches" },
];

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/* rotating hints inside the search field */
const HINTS = ["velvet sofas", "solid wood beds", "6-seater dining", "accent chairs"];

/* ── animated count badge ─────────────────────────────────── */
function CountBadge({ count, tone = "clay" }) {
  const tones = {
    clay: "bg-clay-600",
    ink: "bg-ink-900",
  };
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={springSnappy}
          className={`absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white ring-2 ring-sand-50 ${tones[tone]}`}
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ── icon button with hover halo ──────────────────────────── */
const IconAction = React.forwardRef(function IconAction(
  { children, className = "", ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.88 }}
      transition={springSnappy}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-clay-600 ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

/* same affordance as IconAction, but it navigates */
function IconLink({ to, children, className = "", ...rest }) {
  return (
    <Link
      to={to}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-clay-600 active:scale-90 ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hint, setHint] = useState(0);

  const { cartItems } = useCart();
  const { items: wishes } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const profileRef = useRef(null);
  const shopRef = useRef(null);

  /* condense the bar once the page moves */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* rotate the search placeholder */
  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 3200);
    return () => clearInterval(id);
  }, []);

  /* close every overlay on navigation */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setShopOpen(false);
  }, [pathname]);

  /* click-away + Escape for the dropdowns */
  useEffect(() => {
    const onDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setProfileOpen(false);
      setShopOpen(false);
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* lock body scroll behind the mobile drawer */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const gotoCat = (cat) => {
    const path =
      "/products" + (cat && cat !== "all" ? `?category=${encodeURIComponent(cat)}` : "");
    navigate(path, { state: { category: cat } });
    setMenuOpen(false);
    setShopOpen(false);
  };

  const runSearch = () => {
    const term = search.trim();
    if (!term) return;
    const hit = categories.find((c) => c.key.toLowerCase() === term.toLowerCase());
    if (hit) return gotoCat(hit.key);
    navigate(`/products?q=${encodeURIComponent(term)}`);
    setMenuOpen(false);
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(253,252,250,.82)" : "rgba(253,252,250,.55)",
          boxShadow: scrolled
            ? "0 8px 32px -16px rgba(24,21,19,.28)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className="sticky top-0 z-50 border-b border-ink-900/[.06] backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="container-x">
          <motion.div
            animate={{ height: scrolled ? 64 : 76 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex items-center gap-3 sm:gap-5"
          >
            {/* ── logo ── */}
            <Link to="/" className="group flex shrink-0 items-center gap-2.5">
              <motion.span
                whileHover={{ rotate: -8, scale: 1.06 }}
                transition={spring}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-sand-50 shadow-lift"
              >
                <span className="font-display text-lg font-bold leading-none">F</span>
              </motion.span>
              <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-ink-900">
                Furnicasa
              </span>
            </Link>

            {/* ── desktop nav ── */}
            <nav className="ml-4 hidden items-center gap-1 lg:flex">
              {/* Shop mega menu */}
              <div ref={shopRef} className="relative">
                <button
                  onClick={() => setShopOpen((o) => !o)}
                  aria-expanded={shopOpen}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    shopOpen ? "bg-ink-900/[.06] text-ink-900" : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  Shop
                  <motion.span
                    animate={{ rotate: shopOpen ? 180 : 0 }}
                    transition={spring}
                    className="inline-flex"
                  >
                    <ChevronDown size={15} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.24, ease: EASE }}
                      className="absolute left-0 top-full z-50 mt-3 w-[34rem] origin-top-left overflow-hidden rounded-3xl border border-ink-100 bg-white/95 p-3 shadow-float backdrop-blur-xl"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((c, i) => (
                          <motion.button
                            key={c.key}
                            onClick={() => gotoCat(c.key)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.03 * i, duration: 0.3, ease: EASE }}
                            className="group flex flex-col items-start rounded-2xl px-4 py-3 text-left transition-colors hover:bg-sand-100"
                          >
                            <span className="flex w-full items-center justify-between text-sm font-semibold text-ink-900">
                              {titleCase(c.key)}
                              <ArrowRight
                                size={14}
                                className="-translate-x-1 text-clay-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                              />
                            </span>
                            <span className="text-xs text-ink-400">{c.blurb}</span>
                          </motion.button>
                        ))}
                      </div>

                      <button
                        onClick={() => gotoCat("all")}
                        className="mt-2 flex w-full items-center justify-between rounded-2xl bg-ink-900 px-4 py-3.5 text-left text-sm font-semibold text-sand-50 transition-colors hover:bg-clay-600"
                      >
                        Browse the full catalogue
                        <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === l.to
                      ? "text-clay-600"
                      : "text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* ── search ── */}
            <div className="ml-auto hidden max-w-md flex-1 md:block">
              <div className="group relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-clay-600"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  aria-label="Search products"
                  className="w-full rounded-full border border-ink-200/80 bg-white/70 py-2.5 pl-11 pr-4 text-sm text-ink-900 transition-all placeholder:text-ink-400 focus:border-clay-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-clay-500/10"
                />
                {/* animated placeholder — only while empty and unfocused */}
                {!search && (
                  <span className="pointer-events-none absolute left-11 top-1/2 flex -translate-y-1/2 items-center gap-1 text-sm text-ink-400">
                    Search
                    <span className="relative inline-block h-5 w-32 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={hint}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="absolute inset-0 flex items-center text-ink-500"
                        >
                          {HINTS[hint]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* ── actions ── */}
            <div className="ml-auto flex items-center gap-0.5 md:ml-0 md:gap-1">
              {/* profile */}
              <div ref={profileRef} className="relative">
                <IconAction
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-label="Account"
                  aria-expanded={profileOpen}
                >
                  <User size={20} strokeWidth={1.8} />
                  {user && (
                    <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-jade-500 ring-2 ring-sand-50" />
                  )}
                </IconAction>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="absolute right-0 top-full z-50 mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-ink-100 bg-white/95 p-1.5 shadow-float backdrop-blur-xl"
                    >
                      {user ? (
                        <>
                          <div className="mb-1 rounded-xl bg-sand-100 px-3.5 py-3">
                            <p className="text-[11px] uppercase tracking-wider text-ink-400">
                              Signed in as
                            </p>
                            <p className="truncate text-sm font-semibold text-ink-900">
                              {user.email}
                            </p>
                          </div>
                          <MenuLink to="/my-account" icon={LayoutDashboard}>
                            Dashboard
                          </MenuLink>
                          <MenuLink to="/my-account#orders" icon={Package}>
                            My orders
                          </MenuLink>
                          {user.isAdmin && (
                            <MenuLink to="/admin" icon={LayoutDashboard}>
                              Admin dashboard
                            </MenuLink>
                          )}
                          <button
                            onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-clay-600 transition-colors hover:bg-clay-50"
                          >
                            <LogOut size={16} />
                            Log out
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-3.5 py-3">
                            <p className="font-display text-base font-semibold text-ink-900">
                              Welcome
                            </p>
                            <p className="text-xs text-ink-500">
                              Sign in to track orders and save favourites.
                            </p>
                          </div>
                          <Link
                            to="/login"
                            className="btn-primary w-full !py-2.5 text-xs"
                          >
                            Log in
                          </Link>
                          <Link
                            to="/register-advanced"
                            className="mt-1.5 flex w-full items-center justify-center rounded-full px-3.5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-100"
                          >
                            Create an account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* wishlist */}
              <IconLink to="/wishlist" aria-label="Wishlist">
                <Heart size={20} strokeWidth={1.8} />
                <CountBadge count={wishes.length} tone="ink" />
              </IconLink>

              {/* cart */}
              <IconLink to="/cart" aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.8} />
                <CountBadge count={cartItems.length} />
              </IconLink>

              {/* mobile toggle */}
              <IconAction
                className="lg:hidden"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </IconAction>
            </div>
          </motion.div>
        </div>

        {/* ── category strip (desktop, collapses on scroll) ── */}
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : 44, opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="hidden overflow-hidden border-t border-ink-900/[.05] lg:block"
        >
          <div className="container-x flex h-11 items-center justify-center gap-1">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => gotoCat(c.key)}
                className="group relative px-3.5 py-1.5 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                {titleCase(c.key)}
                <span className="absolute inset-x-3.5 bottom-0 h-px origin-center scale-x-0 bg-clay-500 transition-transform duration-300 ease-spring group-hover:scale-x-100" />
              </button>
            ))}
            <button
              onClick={() => gotoCat("all")}
              className="ml-2 rounded-full bg-ink-900/[.06] px-3.5 py-1.5 text-[13px] font-semibold text-ink-800 transition-colors hover:bg-ink-900 hover:text-sand-50"
            >
              All products
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* ── mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-sand-50 shadow-float lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                <span className="font-display text-xl font-semibold">Menu</span>
                <IconAction onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </IconAction>
              </div>

              <div className="flex-1 space-y-7 px-5 py-6">
                {/* search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="Search products…"
                    className="input pl-11"
                  />
                </div>

                <DrawerGroup title="Shop by category" delay={0.05}>
                  {categories.map((c) => (
                    <DrawerButton key={c.key} onClick={() => gotoCat(c.key)}>
                      {titleCase(c.key)}
                    </DrawerButton>
                  ))}
                  <DrawerButton onClick={() => gotoCat("all")} emphasis>
                    All products
                  </DrawerButton>
                </DrawerGroup>

                <DrawerGroup title="Explore" delay={0.12}>
                  <DrawerButton onClick={() => navigate("/about")}>About us</DrawerButton>
                  <DrawerButton onClick={() => navigate("/contact")}>Contact</DrawerButton>
                  <DrawerButton onClick={() => navigate("/wishlist")}>
                    Wishlist ({wishes.length})
                  </DrawerButton>
                  <DrawerButton onClick={() => navigate("/cart")}>
                    Cart ({cartItems.length})
                  </DrawerButton>
                </DrawerGroup>

                <DrawerGroup title="Account" delay={0.18}>
                  {user ? (
                    <>
                      <DrawerButton onClick={() => navigate("/my-account")}>
                        Dashboard
                      </DrawerButton>
                      {user.isAdmin && (
                        <DrawerButton onClick={() => navigate("/admin")}>
                          Admin dashboard
                        </DrawerButton>
                      )}
                      <DrawerButton onClick={handleLogout} danger>
                        Log out
                      </DrawerButton>
                    </>
                  ) : (
                    <div className="space-y-2.5 pt-1">
                      <Link to="/login" className="btn-primary w-full">
                        Log in
                      </Link>
                      <Link to="/register-advanced" className="btn-outline w-full">
                        Create account
                      </Link>
                    </div>
                  )}
                </DrawerGroup>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── drawer helpers ───────────────────────────────────────── */

function DrawerGroup({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: EASE }}
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-ink-400">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </motion.div>
  );
}

function DrawerButton({ children, onClick, emphasis, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-[15px] transition-colors ${
        danger
          ? "font-medium text-clay-600 hover:bg-clay-50"
          : emphasis
            ? "font-semibold text-ink-900 hover:bg-sand-200"
            : "text-ink-700 hover:bg-sand-100"
      }`}
    >
      {children}
      <ArrowRight size={15} className="text-ink-300" />
    </button>
  );
}

function MenuLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
    >
      <Icon size={16} className="text-ink-400" />
      {children}
    </Link>
  );
}
